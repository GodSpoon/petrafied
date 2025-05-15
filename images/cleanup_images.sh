#!/bin/bash

# --- Configuration ---
# Set OLD_BASE_DIR to the path of your current messy directory if not running the script from within it.
# For example: OLD_BASE_DIR="/path/to/your/images"
OLD_BASE_DIR="."
NEW_BASE_DIR="organized_images"
DRY_RUN=true # Set to 'false' to actually move files. KEEP TRUE FOR TESTING!

# --- Helper Functions ---
ensure_dir() {
    local dir_path="$1"
    if [ ! -d "$dir_path" ]; then
        echo "INFO: Creating directory: $dir_path"
        if ! $DRY_RUN; then
            mkdir -p "$dir_path" || { echo "ERROR: Failed to create directory $dir_path. Exiting."; exit 1; }
        fi
    fi
}

# Improved move_file function to handle duplicates by appending a number
move_file() {
    local src_file="$1"
    local dest_dir="$2"
    local original_filename
    original_filename=$(basename "$src_file")
    local dest_file_path="$dest_dir/$original_filename"
    local counter=1

    ensure_dir "$dest_dir"

    # Check if destination is a file or a symlink
    while [ -f "$dest_file_path" ] || [ -L "$dest_file_path" ]; do
        local name_no_ext="${original_filename%.*}"
        local extension="${original_filename##*.}"
        if [[ "$original_filename" == *.* ]]; then # Has extension
            dest_file_path="$dest_dir/${name_no_ext}_${counter}.${extension}"
        else # No extension
            dest_file_path="$dest_dir/${original_filename}_${counter}"
        fi
        ((counter++))
    done

    if [[ "$src_file" != "$dest_file_path" && "$counter" -gt 1 ]]; then
         echo "INFO: Moving '$src_file' to '$dest_file_path' (renamed due to existing file)"
    else
         echo "INFO: Moving '$src_file' to '$dest_file_path'"
    fi

    if ! $DRY_RUN; then
        mv -n "$src_file" "$dest_file_path" || echo "WARNING: Failed to move '$src_file' to '$dest_file_path'"
    fi
}

# Function to recursively move contents of a directory, preserving sub-structure if target exists
# or moving files directly if target is a simple file category.
process_directory_contents() {
    local src_dir="$1"
    local dest_category_dir="$2"
    local preserve_subdir_name="$3" # "yes" or "no"

    if [ ! -d "$src_dir" ]; then
        echo "WARNING: Source directory '$src_dir' not found. Skipping."
        return
    fi

    find "$src_dir" -mindepth 1 -print0 | while IFS= read -r -d $'\0' item; do
        item_basename=$(basename "$item")
        if [ -d "$item" ]; then
            # If it's a directory, decide whether to recreate it in the destination
            # or move its contents directly. This part handles nested subdirs.
            local new_dest_subdir="$dest_category_dir"
            if [ "$preserve_subdir_name" == "yes" ]; then
                # Get relative path from src_dir to item
                local relative_path="${item#$src_dir/}"
                new_dest_subdir="$dest_category_dir/$relative_path"
            fi
            ensure_dir "$new_dest_subdir"
            # Recursively process this subdirectory's files into the new_dest_subdir
            # This logic is simplified here; for deep arbitrary recursion, 'find ... -exec' is better
            # For now, we'll focus on moving files from the current level of find
        elif [ -f "$item" ]; then
            local target_dir="$dest_category_dir"
            if [ "$preserve_subdir_name" == "yes" ]; then
                # Construct target directory by appending the relative path of the file's parent
                local parent_dir
                parent_dir=$(dirname "$item")
                local relative_parent_path="${parent_dir#$src_dir}" # May start with /
                relative_parent_path=$(echo "$relative_parent_path" | sed 's|/*$||') # Remove trailing slash
                 if [[ -n "$relative_parent_path" && "$relative_parent_path" != "." ]]; then
                    target_dir="$dest_category_dir$relative_parent_path"
                fi
            fi
            move_file "$item" "$target_dir"
        fi
    done

    # Attempt to remove the original directory if it's empty (after processing)
    if ! $DRY_RUN && [ -d "$src_dir" ] && [ -z "$(ls -A "$src_dir")" ]; then
        echo "INFO: Removing empty source directory: $src_dir"
        rmdir "$src_dir" || echo "WARNING: Could not remove empty directory $src_dir (maybe not empty or permissions issue)."
    fi
}


# --- Main Reorganization Logic ---

echo "Starting image reorganization..."
if $DRY_RUN; then
    echo "####################################################################"
    echo "## DRY RUN ENABLED. No files will be moved or directories created. ##"
    echo "####################################################################"
fi

ensure_dir "$NEW_BASE_DIR"

# 0. Define Target Directories (makes it easier to change later)
BANNERS_TARGET="$NEW_BASE_DIR/banners"
ICONS_FAVICONS_TARGET="$NEW_BASE_DIR/icons_and_favicons"
FAVICONS_TARGET="$ICONS_FAVICONS_TARGET/favicons"
SVG_ICONS_TARGET="$ICONS_FAVICONS_TARGET/svg_icons"
LEGACY_PIXEL_ICONS_TARGET="$ICONS_FAVICONS_TARGET/legacy_pixel_icons"
WEB_ELEMENTS_TARGET="$NEW_BASE_DIR/web_elements"
BACKGROUNDS_TARGET="$WEB_ELEMENTS_TARGET/backgrounds"
BLINKIES_TARGET="$WEB_ELEMENTS_TARGET/blinkies"
BUTTONS_TARGET="$WEB_ELEMENTS_TARGET/buttons"
DIVIDERS_TARGET="$WEB_ELEMENTS_TARGET/dividers"
DECORATIVE_GIFS_TARGET="$WEB_ELEMENTS_TARGET/decorative_gifs"
USERBARS_TARGET="$WEB_ELEMENTS_TARGET/userbars"
USER_CONTENT_TARGET="$NEW_BASE_DIR/user_generated_content"
AVATARS_TARGET="$USER_CONTENT_TARGET/avatars_and_profile_pics"
CHARACTERS_TARGET="$USER_CONTENT_TARGET/characters_artwork"
INSTAGRAM_TARGET="$USER_CONTENT_TARGET/instagram_posts"
MISC_IMAGES_TARGET="$USER_CONTENT_TARGET/miscellaneous_images"
QUIZZES_TARGET="$USER_CONTENT_TARGET/quiz_results"
STAMPS_BADGES_TARGET="$NEW_BASE_DIR/stamps_and_badges"
FANLIST_TARGET="$STAMPS_BADGES_TARGET/fanlist_badges"
STAMPS_TARGET="$STAMPS_BADGES_TARGET/stamps"
EMAIL_ASSETS_TARGET="$NEW_BASE_DIR/email_assets"
CURSORS_TARGET="$NEW_BASE_DIR/cursors"
MISC_ASSETS_TARGET="$NEW_BASE_DIR/miscellaneous_assets"
VIDEOS_TARGET="$NEW_BASE_DIR/videos" # General videos

# 1. Process top-level files and symlinks
echo "--- Processing top-level items ---"
find "$OLD_BASE_DIR" -maxdepth 1 -type f -print0 | while IFS= read -r -d $'\0' file; do
    filename=$(basename "$file")
    extension="${filename##*.}"
    name_no_ext="${filename%.*}"

    case "$filename" in
        "backdrop.svg") move_file "$file" "$BACKGROUNDS_TARGET" ;;
        "butterfly.gif"|"counter.gif") move_file "$file" "$DECORATIVE_GIFS_TARGET" ;;
        "divider.gif") move_file "$file" "$DIVIDERS_TARGET" ;;
        "stars-bg.gif") move_file "$file" "$BACKGROUNDS_TARGET" ;;
        "cursor.cur"|"cursor-link.cur") move_file "$file" "$CURSORS_TARGET" ;;
        "Heart.png"|"mudkipz.png"|"shmegl.jpg"|"wow.jpg"|"petrafiedlogo.jpg") move_file "$file" "$MISC_IMAGES_TARGET" ;;
        mini*.gif) move_file "$file" "$DECORATIVE_GIFS_TARGET" ;;
        *)
            # Catch-all for other top-level files
            if [[ "$extension" == "gif" || "$extension" == "png" || "$extension" == "jpg" || "$extension" == "jpeg" || "$extension" == "svg" ]]; then
                echo "INFO: Unclassified top-level image '$filename' moving to miscellaneous_assets."
                move_file "$file" "$MISC_ASSETS_TARGET"
            elif [[ "$extension" == "mp4" ]]; then
                 move_file "$file" "$VIDEOS_TARGET"
            else
                echo "INFO: Skipping unknown top-level file: $filename"
            fi
            ;;
    esac
done

# Handle top-level symlinks (ban*.gif)
find "$OLD_BASE_DIR" -maxdepth 1 -type l -name "ban*.gif" -print0 | while IFS= read -r -d $'\0' symlink_file; do
    link_target_rel=$(readlink "$symlink_file")
    link_target_abs=$(readlink -f "$symlink_file") # Absolute path to the target
    target_filename=$(basename "$link_target_abs")

    echo "INFO: Processing symlink '$symlink_file' pointing to '$link_target_rel' (absolute: '$link_target_abs')"
    ensure_dir "$BANNERS_TARGET"

    # Create a unique name for the copied file, incorporating original symlink name if target name clashes
    dest_banner_path="$BANNERS_TARGET/$target_filename"
    counter=1
    original_target_filename="$target_filename"
    while [ -f "$dest_banner_path" ] || [ -L "$dest_banner_path" ]; do
        name_no_ext="${original_target_filename%.*}"
        extension="${original_target_filename##*.}"
        if [[ "$original_target_filename" == *.* ]]; then
             dest_banner_path="$BANNERS_TARGET/${name_no_ext}_from_$(basename "$symlink_file" .gif)_${counter}.${extension}"
        else
             dest_banner_path="$BANNERS_TARGET/${original_target_filename}_from_$(basename "$symlink_file" .gif)_${counter}"
        fi
        ((counter++))
    done

    if [ -f "$link_target_abs" ]; then # Check if the target is a regular file
        echo "INFO: Copying target of symlink '$link_target_abs' to '$dest_banner_path'"
        if ! $DRY_RUN; then
            cp "$link_target_abs" "$dest_banner_path" || echo "WARNING: Failed to copy '$link_target_abs'"
            rm "$symlink_file" || echo "WARNING: Failed to remove original symlink '$symlink_file'"
        fi
    else
        echo "WARNING: Symlink '$symlink_file' points to '$link_target_abs', which is not a regular file or does not exist. Skipping."
    fi
done


# 2. Process `banners` directory
echo "--- Processing './banners' directory ---"
process_directory_contents "$OLD_BASE_DIR/banners" "$BANNERS_TARGET" "no"

# 3. Process `email` directory
echo "--- Processing './email' directory ---"
process_directory_contents "$OLD_BASE_DIR/email" "$EMAIL_ASSETS_TARGET" "no"

# 4. Process `graphix` subdirectories
echo "--- Processing './graphix' subdirectories ---"
GRAPHIX_OLD="$OLD_BASE_DIR/graphix"
if [ -d "$GRAPHIX_OLD" ]; then
    process_directory_contents "$GRAPHIX_OLD/avi" "$AVATARS_TARGET" "no"
    process_directory_contents "$GRAPHIX_OLD/banners" "$BANNERS_TARGET" "no" # Merge with other banners
    process_directory_contents "$GRAPHIX_OLD/bgs" "$BACKGROUNDS_TARGET" "no"
    process_directory_contents "$GRAPHIX_OLD/blinkies" "$BLINKIES_TARGET" "no"
    process_directory_contents "$GRAPHIX_OLD/buttons" "$BUTTONS_TARGET" "yes" # Preserve 'links', 'mine'
    process_directory_contents "$GRAPHIX_OLD/characters" "$CHARACTERS_TARGET" "yes" # Preserve 'mecha'
    process_directory_contents "$GRAPHIX_OLD/dividers" "$DIVIDERS_TARGET" "no"
    process_directory_contents "$GRAPHIX_OLD/fanlist" "$FANLIST_TARGET" "no"
    process_directory_contents "$GRAPHIX_OLD/favicons" "$FAVICONS_TARGET" "yes" # Preserve 'bluelace'
    process_directory_contents "$GRAPHIX_OLD/icons" "$LEGACY_PIXEL_ICONS_TARGET" "yes" # Preserve 'xp'
    process_directory_contents "$GRAPHIX_OLD/misc" "$MISC_ASSETS_TARGET" "no"
    process_directory_contents "$GRAPHIX_OLD/pics" "$MISC_IMAGES_TARGET" "no"
    process_directory_contents "$GRAPHIX_OLD/quizzes" "$QUIZZES_TARGET" "no"
    process_directory_contents "$GRAPHIX_OLD/stamps" "$STAMPS_TARGET" "yes" # Preserve 'eddsworld', 'hex', 'my shit' etc.
    process_directory_contents "$GRAPHIX_OLD/userbars" "$USERBARS_TARGET" "no"

    # Attempt to remove graphix if empty
    if ! $DRY_RUN && [ -z "$(ls -A "$GRAPHIX_OLD" 2>/dev/null)" ]; then
        echo "INFO: Removing empty source directory: $GRAPHIX_OLD"
        rmdir "$GRAPHIX_OLD" || echo "WARNING: Could not remove $GRAPHIX_OLD"
    fi
else
    echo "INFO: Directory '$GRAPHIX_OLD' not found."
fi


# 5. Process top-level `icons` directory (SVGs)
echo "--- Processing top-level './icons' directory (SVGs) ---"
process_directory_contents "$OLD_BASE_DIR/icons" "$SVG_ICONS_TARGET" "no" # Assuming all in here are SVGs for svg_icons

# 6. Process `instagramposts` directory
echo "--- Processing './instagramposts' directory ---"
INSTAGRAM_OLD="$OLD_BASE_DIR/instagramposts"
if [ -d "$INSTAGRAM_OLD" ]; then
    find "$INSTAGRAM_OLD" -maxdepth 1 -type f -print0 | while IFS= read -r -d $'\0' file; do
        filename=$(basename "$file")
        extension="${filename##*.}"
        if [[ "$extension" == "mp4" ]]; then
            move_file "$file" "$INSTAGRAM_TARGET" # Keep videos with their posts
        else # jpg, etc.
            move_file "$file" "$INSTAGRAM_TARGET"
        fi
    done
    if ! $DRY_RUN && [ -z "$(ls -A "$INSTAGRAM_OLD" 2>/dev/null)" ]; then
        echo "INFO: Removing empty source directory: $INSTAGRAM_OLD"
        rmdir "$INSTAGRAM_OLD" || echo "WARNING: Could not remove $INSTAGRAM_OLD"
    fi
else
    echo "INFO: Directory '$INSTAGRAM_OLD' not found."
fi

# 7. Clean up empty 'tree' directory
TREE_OLD="$OLD_BASE_DIR/tree"
if [ -d "$TREE_OLD" ] && [ -z "$(ls -A "$TREE_OLD" 2>/dev/null)" ]; then
    echo "INFO: Removing empty directory: $TREE_OLD"
    if ! $DRY_RUN; then rmdir "$TREE_OLD" || echo "WARNING: Could not remove $TREE_OLD"; fi
fi

# 8. Final sweep for any remaining top-level directories that might now be empty
echo "--- Final cleanup of potentially empty source directories ---"
if ! $DRY_RUN; then
    for dir_to_check in "$OLD_BASE_DIR/banners" "$OLD_BASE_DIR/email" "$OLD_BASE_DIR/icons" "$OLD_BASE_DIR/instagramposts"; do
        if [ -d "$dir_to_check" ] && [ -z "$(ls -A "$dir_to_check" 2>/dev/null)" ]; then
            echo "INFO: Removing now empty source directory: $dir_to_check"
            rmdir "$dir_to_check" || echo "WARNING: Could not remove $dir_to_check (it might not be empty or permissions issue)."
        fi
    done
fi


echo "--- Reorganization Script Finished ---"
if $DRY_RUN; then
    echo "DRY RUN was enabled. No actual changes were made."
    echo "Review the output above. If it looks correct, change DRY_RUN to false and re-run."
    echo "MAKE SURE YOU HAVE A BACKUP BEFORE RUNNING WITH DRY_RUN=false."
else
    echo "File reorganization complete into '$NEW_BASE_DIR'."
    echo "Please check the new directory structure and contents."
fi

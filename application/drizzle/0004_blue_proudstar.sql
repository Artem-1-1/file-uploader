-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION get_folder_size(target_folder_id TEXT) 
RETURNS BIGINT AS $$
  WITH RECURSIVE folder_tree AS (
    SELECT id, parent_id, size 
    FROM file 
    WHERE parent_id = target_folder_id AND deleted_at IS NULL
    
    UNION ALL
    
    SELECT f.id, f.parent_id, f.size 
    FROM file f
    INNER JOIN folder_tree ft ON f.parent_id = ft.id
    WHERE f.deleted_at IS NULL
  )
  SELECT COALESCE(SUM(size), 0)::bigint FROM folder_tree;
$$ LANGUAGE sql STABLE;
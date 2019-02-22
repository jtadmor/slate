import { Map, List } from 'immutable'
import PathUtils from './path-utils'

function addPaths(tree = Map(), paths) {
  if (!paths) {
    return tree
  }

  return tree.withMutations(map => {
    paths.forEach(path => {
      if (path && path.size && !map.hasIn(path)) {
        map.setIn(path, Map())
      }
    })
  })
}

function createFromPaths(paths) {
  const tree = addPaths(Map(), paths)

  return tree
}

function getPathArray(tree = Map()) {
  function walker(localTree, parentPath = PathUtils.create([])) {
    return localTree.reduce((arr, subTree, key) => {
      const fullPath = parentPath.concat(key)

      if (subTree && subTree.size) {
        arr = arr.concat(walker(subTree, fullPath))
      }

      arr.push(fullPath)

      return arr
    }, [])
  }

  const arr = walker(tree)

  arr.push(PathUtils.create([]))

  return arr
}

function forEachEqualOrGreaterPath(
  tree = Map(),
  fn,
  targetPath = PathUtils.create([]),
  fromRight = false
) {
  function walker(localTree, parentPath = PathUtils.create([])) {
    const continuation_arr = []

    const index = parentPath.size
    const start_at = targetPath.get(index, 0)

    const lt = fromRight ? localTree.sort().reverse() : localTree.sort()

    lt.forEach((subTree, key) => {
      if (key >= start_at) {
        const fullPath = parentPath.concat(key)

        let ret

        if (
          PathUtils.isYounger(targetPath, fullPath) ||
          PathUtils.isAbove(targetPath, fullPath) ||
          PathUtils.isEqual(targetPath, fullPath)
        ) {
          ret = fn(subTree, fullPath)
        }

        if (ret !== false) {
          continuation_arr.push(fullPath)
        }
      }
    })

    continuation_arr.forEach(path => {
      walker(tree.getIn(path), path)
    })
  }

  walker(tree)
}

const TREE_CHANGING_OP_TYPES = [
  'insert_node',
  'remove_node',
  'split_node',
  'merge_node',
  'move_node',
]

function transform(tree = Map(), operation) {
  const { type, position, path, newPath } = operation

  if (TREE_CHANGING_OP_TYPES.indexOf(type) === -1) {
    return tree
  }

  if (type === 'insert_node') {
    return tree.withMutations(transformed => {
      // Iterate from right to left so that as we delete existing nodes,
      // We are not deleting nodes that just moved
      forEachEqualOrGreaterPath(
        tree,
        (localTree, localPath) => {
          // Bump existing paths up one as appropriate
          transformed.setIn(PathUtils.increment(localPath), localTree)

          // Delete the tree at this path
          transformed.deleteIn(localPath)

          return false
        },
        path,
        true
      )
    })
  }

  if (type === 'remove_node') {
    if (tree.hasIn(path)) {
      tree = tree.deleteIn(path)
    }

    return tree.withMutations(transformed => {
      // Iterate from left to right so that as we delete existing nodes,
      // We are not deleting nodes that just moved
      forEachEqualOrGreaterPath(
        tree,
        (localTree, localPath) => {
          // Bump existing paths down one as appropriate
          transformed.setIn(PathUtils.decrement(localPath), localTree)

          // Delete the tree at this path
          transformed.deleteIn(localPath)

          return false
        },
        path
      )
    })
  }

  if (type === 'merge_node') {
    return tree.withMutations(transformed => {
      forEachEqualOrGreaterPath(
        tree,
        (localTree, localPath) => {
          if (PathUtils.isEqual(localPath, path)) {
            transformed.deleteIn(localPath)
            // We want to iterate the children of the node that gets merged, so return true
            return true
          } else if (PathUtils.isAbove(path, localPath)) {
            // Move the child of the merged node to its new path, then stop iterating
            let newPath = PathUtils.decrement(localPath, 1, path.size - 1)
            newPath = PathUtils.increment(newPath, position)

            transformed.setIn(newPath, localTree)
            transformed.deleteIn(localPath)

            return false
          }

          // Same logic as remove_node
          transformed.setIn(PathUtils.decrement(localPath), localTree)
          transformed.deleteIn(localPath)

          return false
        },
        path
      )
    })
  }

  if (type === 'split_node') {
    return tree.withMutations(transformed => {
      forEachEqualOrGreaterPath(
        tree,
        (localTree, localPath) => {
          if (PathUtils.isEqual(localPath, path)) {
            // We want to iterate the children of the node that got split, so return true
            return true
          } else if (PathUtils.isAbove(path, localPath)) {
            // Move all of the children after the split point to the new node
            if (localPath.last() >= position) {
              transformed.deleteIn(localPath)
              let newPath = PathUtils.increment(
                localPath,
                1,
                localPath.size - 2
              )
              newPath = PathUtils.decrement(newPath, position)
              transformed.setIn(newPath, localTree)
            }

            return false
          }

          // Same logic as insert_node
          transformed.setIn(PathUtils.increment(localPath), localTree)
          transformed.deleteIn(localPath)

          return false
        },
        path,
        true
      )

      // We should have had some children nodes moved which would create this, but do a sanity check
      const newNodePath = PathUtils.increment(path)
      if (!transformed.getIn(newNodePath)) {
        transformed.setIn(newNodePath, Map())
      }
    })
  }

  if (type === 'move_node') {
    const movedTree = tree.getIn(path, Map())
    const realNewPath = PathUtils.transform(path, operation).first()

    let transformed = transform(tree, {
      type: 'remove_node',
      path,
    })

    transformed = transform(transformed, {
      type: 'insert_node',
      path: realNewPath,
    })

    transformed = transformed.setIn(realNewPath, movedTree)

    return transformed
  }

  return tree
}

/**
 * Get a list of unique paths, including ancestors, from a list of paths
 *
 * @param {List<Path>|Array<Path>} paths
 * @return {List<List>}
 */

function getUniquePathsWithAncestors(paths) {
  const tree = createFromPaths(paths)
  const arr = getPathArray(tree)

  return arr
}

function getLeafPath(tree = Map()) {
  let currentTree = tree
  const path = []

  while (currentTree.size) {
    const pathPart = currentTree.keySeq().last()
    currentTree = currentTree.get(pathPart)
    path.push(pathPart)
  }

  return PathUtils.create(path)
}

export default {
  addPaths,
  createFromPaths,
  transform,
  getPathArray,
  getUniquePathsWithAncestors,
  getLeafPath,
}

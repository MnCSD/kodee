import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { type TreeItem } from "@/types";

/**
 * Normalize and merge CSS class name inputs into a single string suitable for Tailwind.
 *
 * Accepts the same inputs as `clsx` (strings, arrays, objects, etc.), normalizes them,
 * and resolves Tailwind-specific class conflicts via `twMerge`.
 *
 * @param inputs - One or more class value(s) (strings, arrays, or objects) accepted by `clsx`
 * @returns The resulting merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a flat map of file paths into a nested TreeItem array for a TreeView.
 *
 * Builds a hierarchical representation where file path keys are split by `/`.
 * Folder nodes become arrays with the folder name followed by their children;
 * files become string leaf items. The file contents (map values) are ignored.
 *
 * @param files - Map from file path (e.g., "src/Button.tsx") to file content (ignored)
 * @returns An array of TreeItem where files are strings and folders are `[name, ...children]`
 *
 * @example
 * Input: { "src/Button.tsx": "...", "README.md": "..." }
 * Output: [["src", "Button.tsx"], "README.md"]
 */
export function convertFilesToTreeItems(
  files: Record<string, string>
): TreeItem[] {
  // Define proper type for tree structure
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  // Build a tree structure first
  const tree: TreeNode = {};

  // Sort files to ensure consistent ordering
  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;

    // Navigate/create the tree structure
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    // Add the file (leaf node)
    const fileName = parts[parts.length - 1];
    current[fileName] = null; // null indicates it's a file
  }

  /**
   * Convert an intermediate TreeNode into a TreeItem or array of TreeItems for a TreeView.
   *
   * Recursively transforms a nested TreeNode (where keys are folder or file names and
   * values are either a child TreeNode or `null` for files) into the TreeItem format:
   * - Files become string items (e.g., `"file.txt"`).
   * - Folders become arrays whose first element is the folder name and remaining
   *   elements are its children (e.g., `["folder", "child1", ["sub", "child2"]]`).
   *
   * @param node - A TreeNode representing a folder's contents (map of name → TreeNode | null).
   * @param name - Optional name to use when the provided node is empty; returned as a leaf string.
   * @returns A single TreeItem when `node` represents a single leaf (string or `[name, ...]`), otherwise an array of TreeItem for the node's children.
   */
  function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
    const entries = Object.entries(node);

    if (entries.length === 0) {
      return name || "";
    }

    const children: TreeItem[] = [];

    for (const [key, value] of entries) {
      if (value === null) {
        // It's a file
        children.push(key);
      } else {
        // It's a folder
        const subTree = convertNode(value, key);
        if (Array.isArray(subTree)) {
          children.push([key, ...subTree]);
        } else {
          children.push([key, subTree]);
        }
      }
    }

    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
}

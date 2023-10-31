# Remix Drag and Drop Example

This example uses `react-dnd` and `useFetcher` to post to action.
When the `drop` method is called on the target, it calls `fetcher.submit`
to POST the item to the action. The action returns the item name.

It displays the drop message "optimistically" during submission, and
displays the final message from the action data (`fetcher.data`).

This was a challenging project. Here we were provided with an array of fictional employees. Each employee eis represented as an object. We had to iterate through the array, and cause each employee to appear as a row in a sortable table, with pagination. Adding each employee as a row is simple enough.

On challenge was to make the table sortable. Pagination was also a challenge. In both cases, I used event listeners to listen for clicks on the table headers and the pagination buttons. When a click is detected, the appropriate function is called.

I also added keyboard navigation such that user can use the arrow keys to navigate the table pages. I also added a `lastFirst` property to each employee object, and this is how the names are sorted.

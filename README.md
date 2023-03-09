<!-- ABOUT THE PROJECT -->
# Collapse Menu
### Project Demo
* Deploy on github page
   https://s27840213.github.io/Collapse-Menu/

### Project Requirement
1. Based on the information provided an expandable/collapsible elements component
2. Each item can be clicked, and when clicked, highlight the clicked item, and if the item has sub elements, open the menu of the item.
3. There is only one expanded and highlighted item at a time.
4. A drop-down menu is also provided, which must contain all categories. Selecting any item from the drop-down menu is the same action as clicking on that item.
### Primary Tech stack

* **Vue3**
* **Vite**
* Typescript
* Pug
* SCSS
* Prettier + ESLint


<!-- GETTING STARTED -->
### Prerequisites
Pay attention to the **NodeJS version**. My NodeJS version is v16.19.1. If you're using the different version of NodeJS, maybe you will get some problems when executing the project locally.

### Installation
If you want to run the project locally, follow the bellow steps

* first clone the project 
   ```
   git clone https://github.com/s27840213/Collapse-Menu.git
  ```
* install the dependencies
  ```
  pnpm install
  ```
* execute the project
   ```sh
  pnpm dev
  ```


### Bonus Question
  * **In the above component design, please consider how to plan reasonably under the structure that supports up to 100 layers, and try to explain it?**
    - Answer:
      - we could create a hash map for search the target layer much more quickly, and in this project I used ES6 Map object instead of normal Object, because it's iterable.
      - use v-if instead of v-show for hiding/showing the collapse item to reduce the memory usage. v-show just use display: none to hide the element, but it still in the DOM; (Although for the frequently switch element, using v-show would be better.)
      - maybe we could add a lazy-loading to each collapse item to prevent the instant high memory usage when open a very deep item through the dropdown menu
      - Conclusion:
        - Hash map
        - Use v-if instead of v-show
        - Lazy load

### Question for myself
* How to implement the lazy loading for the nested structure?
* In the project I used max-height for transition, does using max-height for transition is better than using height for transition?
* Currently, the provided data for the collapse menu is static data, if the data is dynamic, would the structure changed?
* If the item in 100th layer was clicked, and if the collapse item is out of the viewport of browser, how to handle this problems?
  * this problems is related to UI, so maybe the best choice is to discuss with the UI/UX designer 
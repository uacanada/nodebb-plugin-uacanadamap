"use strict";
define("core/fragmentManager", [
  "core/variables" /*   Global object UacanadaMap  */,
], function (UacanadaMap) {

class FragmentManager {
    constructor() {
      // An object to store fragments, keyed by their IDs.
      this.fragments = {};
    }
  
    /**
     * Create a new DocumentFragment with a given HTML string and ID.
     *
     * @param {string} id - The ID to associate with the fragment.
     * @param {string} htmlString - The HTML content for the fragment.
     */
    createFragment(id, htmlString) {
      const fragment = document.createDocumentFragment();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      this.fragments[id] = fragment;
    }
  
    /**
     * Load the contents of a fragment into a specified element on the page,
     * with an optional callback.
     *
     * @param {string} id - The ID of the fragment to load.
     * @param {string} elementId - The ID of the element where the fragment will be inserted.
     * @param {Function} [callback] - An optional callback function to run after inserting the fragment.
     * @param {boolean} [shouldMove=true] - Whether to move (true) or copy (false) the fragment into the element.
     */
    loadFragmentToElement(id, elementId, callback, shouldMove = true) {
      const fragment = this.fragments[id];
      if (!fragment) {
        console.warn(`Fragment with ID ${id} not found.`);
        return;
      }
      const targetElement = document.getElementById(elementId);
      const tempFragment = shouldMove ? fragment.cloneNode(true) : fragment;
  
      targetElement.innerHTML = ''; // Clear the target element before inserting the new content.
      targetElement.appendChild(tempFragment);
  
      if (callback) {
        callback();
      }
    }
  
    /**
     * Manipulate the HTML content within a specified fragment using a callback function.
     *
     * @param {string} id - The ID of the fragment to manipulate.
     * @param {Function} manipulatorFn - The function to run for the manipulation.
     */
    manipulateFragment(id, manipulatorFn) {
      const fragment = this.fragments[id];
      if (!fragment) {
        console.warn(`Fragment with ID ${id} not found.`);
        return;
      }
      manipulatorFn(fragment);
    }
  
    /**
     * Move HTML content from a specified element on the page into a fragment.
     *
     * @param {string} elementId - The ID of the element to move content from.
     * @param {string} fragmentId - The ID of the fragment to move content into.
     */
    moveElementContentToFragment(elementId, fragmentId) {
      const fragment = this.fragments[fragmentId] || document.createDocumentFragment();
      const element = document.getElementById(elementId);
  
      while (element.firstChild) {
        fragment.appendChild(element.firstChild);
      }
  
      this.fragments[fragmentId] = fragment;
    }
  }
  
/*
  // Example Usage

  UacanadaMap.fragment.createFragment('myFragment', '<div class="card">This is a card</div>');
  
  // Load the fragment into a target element and execute a callback function
  UacanadaMap.fragment.loadFragmentToElement('myFragment', 'targetElement', () => {
    console.log('Fragment has been loaded');
  });
  
  // Manipulate the HTML content within a fragment
  UacanadaMap.fragment.manipulateFragment('myFragment', (fragment) => {
    const newElement = document.createElement('div');
    newElement.innerHTML = 'New Content';
    fragment.appendChild(newElement);
  });
  
  // Move HTML content from an element into a fragment
  UacanadaMap.fragment.moveElementContentToFragment('elementToMove', 'myFragment');
  
  */

})
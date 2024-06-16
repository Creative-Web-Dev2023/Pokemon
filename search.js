
const inputElement = document.querySelector("#search-input");
const searchIcon = document.querySelector("#search-close-icon");
const sortWrapper = document.querySelector(".sort-wrapper");

// Add event
function handleInputChange() { // This function is called when the input value changes
  const inputValue = this.value;  
  if (inputValue !== "") {    // If the input is not empty, show the close icon
    searchIcon.classList.add("search-close-icon-visible"); // If the input is not empty, show the close icon
  } else {
    searchIcon.classList.remove("search-close-icon-visible");  // If the input is empty, hide the close icon
  }
}

function handleSearchCloseOnClick() { // This function is called when the close icon is clicked
  inputElement.value = ""; // Clear the input and hide the close icon
  searchIcon.classList.remove("search-close-icon-visible"); // Clear the input and hide the close icon
}

function handleSortIconOnClick() { // This function is called when the sort wrapper is clicked
  document.querySelector(".filter-wrapper").classList.toggle("filter-wrapper-open"); // Toggle the visibility of the filter wrapper and the overlay
  document.querySelector("body").classList.toggle("filter-wrapper-overlay");
}


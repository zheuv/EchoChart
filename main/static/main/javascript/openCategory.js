function openCategory(evt, categoryName) {
    var i, content, tabs;

    // Hide all category content
    content = document.getElementsByClassName("category-content");
    for (i = 0; i < content.length; i++) {
        content[i].style.display = "none";
    }

    // Remove active class from all tabs
    tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(" active", "");
    }

    // Show the current category content and add active class to the clicked tab
    document.getElementById(categoryName).style.display = "block";
    evt.currentTarget.className += " active";

    // Fetch data for the selected category
    fetchit(categoryName + '-options');
}


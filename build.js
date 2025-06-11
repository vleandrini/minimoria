document.addEventListener("DOMContentLoaded", () => {
  console.log("Script is working inside Webflow!");
});

document.addEventListener("DOMContentLoaded", function () {
  const allLabels = document.querySelectorAll("label.build-selector-card");
  const materialInputs = document.querySelectorAll('input[name="material"].build-radio_btn');

  function updateSelectedState() {
    // Remove from all
    allLabels.forEach(label => label.classList.remove("is-selected"));

    // Find the checked radio and apply to its parent label
    materialInputs.forEach(input => {
      if (input.checked) {
        const parentLabel = input.closest("label.build-selector-card");
        if (parentLabel) parentLabel.classList.add("is-selected");
      }
    });
  }

  // Run once on page load (to remove static is-selected from HTML)
  updateSelectedState();

  // Add listener to each radio input
  materialInputs.forEach(input => {
    input.addEventListener("change", updateSelectedState);
  });
});

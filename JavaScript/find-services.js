// Allows one category to be selected at a time
const categoryButtons = document.querySelectorAll('.category-button');

categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const wasSelected = button.classList.contains('selected');

        // Clears the previous selection
        categoryButtons.forEach((categoryButton) => {
            categoryButton.classList.remove('selected');
            categoryButton.setAttribute('aria-pressed', 'false');
        });

        if (!wasSelected) {
            button.classList.add('selected');
            button.setAttribute('aria-pressed', 'true');
        }
    });
});
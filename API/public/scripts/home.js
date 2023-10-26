function switchTheme() {
  document.getElementById("switch").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  menuToggle.addEventListener("click", function () {
    mainNav.classList.toggle("show"); // Toggle the 'show' class on mainNav
  });
});

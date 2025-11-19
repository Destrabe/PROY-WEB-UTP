function showToast(message) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span>${message}</span>
    <button class="close-btn">✖</button>
  `;

  container.appendChild(toast);

  toast.querySelector(".close-btn").addEventListener("click", () => {
    closeToast(toast);
  });

  //5s
  setTimeout(() => {
    closeToast(toast);
  }, 5000);
}

function closeToast(toast) {
  toast.style.animation = "fadeOut 0.3s forwards";

  setTimeout(() => {
    toast.remove();
  }, 300);
}

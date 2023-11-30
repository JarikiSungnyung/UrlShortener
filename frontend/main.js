document.getElementById("url-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const url = document.getElementById("url").value;
  const response = await fetch("http://localhost:3000/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });
  const data = await response.json();
  document.getElementById("result").textContent = `Short URL: ${data.short_url}`;
  document.getElementById("copy-button").style.display = "block";
  document.getElementById("copy-button").dataset.clipboardText = data.short_url;
  document.getElementById("warning").style.display = "block";
});

document.getElementById("copy-button").addEventListener("click", function () {
  const tempElem = document.createElement("textarea");
  tempElem.value = this.dataset.clipboardText;
  document.body.appendChild(tempElem);

  tempElem.select();
  document.execCommand("copy");
  document.body.removeChild(tempElem);

  alert("Copied to clipboard!");
});

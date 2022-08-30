const form = document.querySelector("form");
const emailError = document.querySelector(".email.error");
const passwordError = document.querySelector(".password.error");

form.addEventListener("submit", async (e) => {
  console.log("click");
  e.preventDefault();

  // reset errors
  emailError.textContent = "";
  passwordError.textContent = "";

  //get the values
  const email = form.email.value;
  const password = form.password.value;
  console.log(email, password);

  try {
    const res = await fetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "content-type": "application/json" },
    });
    const data = await res.json();
    if (data.errors) {
      emailError.textContent = data.errors.email;
      passwordError.textContent = data.errors.password;
    }
    if (data.user) {
      location.assign("/");
    }
  } catch (err) {
    console.log(err);
  }
});

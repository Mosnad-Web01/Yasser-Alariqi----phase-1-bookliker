let list = document.getElementById("list");
let showPanel = document.getElementById("show-panel");

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/books")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      data.forEach((item) => {
        let listItem = document.createElement("li");
        listItem.textContent = item.title;
        list.appendChild(listItem);

        listItem.addEventListener("click", function () {
          fetch(`http://localhost:3000/books/${item.id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch book details");
              } else {
                return response.json();
              }
            })
            .then((data) => {
              showPanel.innerHTML = `
                <img src="${data.img_url}" alt="${data.title}">
                <h1>${data.title}</h1>
                <h3>${data.author}</h3>
                <p>${data.subtitle}</p>
                <p>${data.description}</p>
                <ul>
                  ${data.users
                    .map((user) => `<li>${user.username}</li>`)
                    .join("")}
                </ul>
                <button id="like">Like</button>
              `;

              let likeButton = document.getElementById("like");
              likeButton.addEventListener("click", () => {
                let currentUser = { id: 1, username: "Yasser Alariqi" };

                let userIndex = data.users.findIndex(
                  (user) => user.id === currentUser.id
                );

                if (userIndex === -1) {
                  data.users.push(currentUser);
                } else {
                  data.users.splice(userIndex, 1);
                }

                fetch(`http://localhost:3000/books/${item.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ users: data.users }),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Failed to update likes");
                    }
                    return response.json();
                  })
                  .then((updatedData) => {
                    showPanel.querySelector("ul").innerHTML = updatedData.users
                      .map((user) => `<li>${user.username}</li>`)
                      .join("");
                  })
                  .catch((error) => console.error(error.message));
              });
            });
        });
      });
    })
    .catch((error) => console.error(error.message));
});

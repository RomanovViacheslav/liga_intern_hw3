const getDogButton = document.querySelector("#get-dog-btn");
const dogImageContainer = document.querySelector(".image-container");

const getDogImage = async () => {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    if (!response.ok) {
      throw new Error(`Ошибка:( Статус: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.message;

    dogImageContainer.innerHTML = "";

    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = imageUrl;
    const caption = document.createElement("figcaption");
    caption.textContent = "Случайная картинка собаки";
    figure.appendChild(img);
    figure.appendChild(caption);

    dogImageContainer.appendChild(figure);
  } catch (error) {
    console.error(error);
  }
};

getDogButton.addEventListener("click", getDogImage);

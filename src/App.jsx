
//Los componentes no deben de salirse del div con id "parent" al arrastrarse

//Cada componente debe de tener una imagen única, la cual con estilos propios, no debe salir del componente al que se le hace resize y deben de tener un fit diferente "cover", "contain", etc. e

//Esta se obtiene de un fetch a la api "https://jsonplaceholder.typicode.com/photos"**

// Se debe de mantener la selección correctamente al hacer resize o drag, desde cualquiera de los 8 puntos (es decir, debe abarcar el componente mismo, no debe de estar abarcando cosas fuera de el) **Referencia del comportamiento que se debe corregir (Video 1)**

// Los componentes se deben de poder eliminar de la lista de componentes

// (Extra) La librería tiene la capacidad de mostrar las líneas guía de cada componente, debes mostrarlas cada que se haga drag del componente seleccionado. La documentación de la librería está aquí: https://daybrush.com/moveable/release/latest/doc/

// (Extra) El código entregado tiene falta de documentación en sus funciones, por lo que también deberás documentar las funciones correctamente
import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";
import { useFetch } from "./hooks";

const App = () => {
  const url = `https://jsonplaceholder.typicode.com/photos`
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const { data: images, error, loading } = useFetch(url)
  const addMoveable = () => {
    // Create a new moveable component and add it to the array that contains images from the data
    //const COLORS = ["red", "blue", "yellow", "green", "purple"];
    const image = images[Math.floor(Math.random() * images.length)];
    setMoveableComponents([
      ...moveableComponents,
      {
        id: moveableComponents.length,
        image: loading ? '' : image.url,
        width: 100,
        height: 100,
        top: 0,
        down: 0,
        right: 0,
        left: 0,
        updateEnd: true
      }
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, _i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };
  const handleResizeStart = (_index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, _handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
      e.set([initialLeft, initialWidth]);
    }
  };






  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  down,
  right,
  left,
  width,
  height,
  index,
  image,
  id,
  setSelected,
  isSelected = false,
  updateEnd,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    down,
    right,
    left,
    width,
    height,
    index,
    image,
    id,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxDown = down + newHeight;
    const positionMaxLeft = left + newWidth;
    const positionMaxRight = right + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxDown > parentBounds?.height)
      newHeight = parentBounds?.height - down;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;
    if (positionMaxRight > parentBounds?.width)
      newWidth = parentBounds?.width - right;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      down,
      left,
      right,
      width: newWidth,
      height: newHeight,
      image,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;



    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  const onResizeEnd = async (e) => {
    let newWidth = e.lastEvent?.width;
    let newHeight = e.lastEvent?.height;

    const positionMaxTop = top + newHeight;
    const positionMaxDown = down + newHeight;
    const positionMaxLeft = left + newWidth;
    const positionMaxRight = right + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxDown > parentBounds?.height)
      newHeight = parentBounds?.height - down;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;
    if (positionMaxRight > parentBounds?.width)
      newWidth = parentBounds?.width - right;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    const { lastEvent } = e;
    const { drag } = lastEvent;
    const { beforeTranslate } = drag;

    const absoluteTop = top + beforeTranslate[2];
    const absoluteDown = down + beforeTranslate[1];
    const absoluteLeft = left + beforeTranslate[-1];
    const absoluteRight = right + beforeTranslate[-1];

    updateMoveable(
      id,
      {
        top: absoluteTop,
        down: absoluteDown,
        left: absoluteLeft,
        right: absoluteRight,
        width: newWidth,
        height: newHeight,
        image,
      },
      true
    );
  };
  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          down: down,
          left: left,
          right: right,
          width: width,
          height: height,
          backgroundImage: `url(${image})`,
        }}
        onClick={() => setSelected(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={(e) => {
          updateMoveable(id, {
            top: e.top,
            down: e.down,
            left: e.left,
            right: e.right,
            width,
            height,
            backgroundImage: `url(${image})`,
          });
        }}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import Swal from "sweetalert2";

interface Rectangle {
  id?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  strokeWidth: number;
  text?: string;
}
interface Apparaat {
  id: number;
  naam: string;
  slim: boolean;
  apparaatType: string;
  huisId: number;
  status: boolean;
  KamerId?: number | null;
}

const MAX_SCALE = 3;
const MIN_SCALE = 0.5;

const Plattegrond: React.FC = () => {
  const [rooms, setRooms] = useState<Rectangle[]>([]);
  const [devices, setDevices] = useState<Rectangle[]>([]);
  const [newRectangle, setNewRectangle] = useState<Rectangle | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scale, setScale] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number | null>(
    null
  );

  const [selectedRectangleIndex, setSelectedRectangleIndex] = useState<
    number | null
  >(null);
  const stageRef = useRef<any>(null);
  const historyRef = useRef<Rectangle[][]>([[]]);
  const [apparaten, setApparaten] = useState<Apparaat[]>([]);
  const [vasteApparaten, setVasteApparaten] = useState<Apparaat[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Apparaat | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwtToken="))
    ?.split("=")[1];
  const huisid = localStorage.getItem("GeselecteerdeWoningsID");
  const fetchApparaten = async () => {
    try {
      const response = await fetch(
        "https://localhost:7032/Apparaten?HuisId=" + huisid,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setVasteApparaten(data); // Sla de complete lijst op zonder filtering
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateplattegrond = async (Kamers: string, Apparaten: string) => {
    try {
      const response = await fetch(
        "https://localhost:7032/Huis/UpdatePlattegrond",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            HuisID: huisid,
            KamersJson: Kamers,
            ApparatenJson: Apparaten,
          }),
        }
      );
      if (response.status === 200) {
        console.log("Data updated successfully");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  const loadRoomsAndDevices = async () => {
    try {
      const response = await fetch(
        "https://localhost:7032/KrijgPlattegrondInformatie?HuisId=" + huisid,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.kamersJson === null) {
        setRooms([]);
        setDevices([]);
      } else {
        const rooms = JSON.parse(data.kamersJson);
        const devices = JSON.parse(data.apparatenJson);

        setRooms(rooms);
        setDevices(devices);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    // Maak een set van de device-IDs die al op de plattegrond staan
    const deviceIds = new Set(devices.map((device) => device.id));

    // Filter `vasteApparaten` op basis van de al geplaatste apparaten
    const filteredApparaten = vasteApparaten.filter(
      (apparaat) => !deviceIds.has(apparaat.id)
    );

    // Werk de `apparaten`-lijst bij met alleen ongeplaatste apparaten
    setApparaten(filteredApparaten);
  }, [devices, vasteApparaten]);

  useEffect(() => {
    fetchApparaten();
    loadRoomsAndDevices();
  }, []);

  const handleMouseDown = (e: any) => {
    if (!isEditing) return;

    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();

    // Convert pointer position to unscaled coordinates
    const transformedPointerPosition = {
      x: (pointerPosition.x - stage.x()) / scale,
      y: (pointerPosition.y - stage.y()) / scale,
    };

    setNewRectangle({
      x: transformedPointerPosition.x,
      y: transformedPointerPosition.y,
      width: 0,
      height: 0,
      stroke: "black",
      strokeWidth: 2,
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !newRectangle) return;

    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();

    // Convert pointer position to unscaled coordinates
    const transformedPointerPosition = {
      x: (pointerPosition.x - stage.x()) / scale,
      y: (pointerPosition.y - stage.y()) / scale,
    };

    // Update width and height of the new rectangle
    const width = transformedPointerPosition.x - newRectangle.x;
    const height = transformedPointerPosition.y - newRectangle.y;

    setNewRectangle({
      ...newRectangle,
      width: width,
      height: height,
    });
  };

  // Hulpfunctie voor het genereren van unieke ID's
  const generateUniqueId = () => {
    // Extract room numbers from the devices
    const roomNumbers = rooms.map((room) => room.id);

    // Find the highest room number
    const highestRoomNumber = Math.max(
      0,
      ...roomNumbers.filter((num): num is number => num !== undefined)
    );

    // Generate a new unique ID by incrementing the highest room number
    const newUniqueId = highestRoomNumber + 1;

    return newUniqueId;
  };

  const handleMouseUp = () => {
    if (!isDrawing || !newRectangle) return;
    if (newRectangle.width > 0 && newRectangle.height > 0) {
      // Check if the new rectangle overlaps with any existing room
      const isOverlappingRoom = rooms.some((room) =>
        isOverlapping(newRectangle, room)
      );

      if (!isOverlappingRoom) {
        // No overlap, add the new room
        const newRoom = { ...newRectangle, id: generateUniqueId() }; // Add a unique ID
        const newRooms = [...rooms, newRoom];
        setRooms(newRooms);
        historyRef.current.push(newRooms);
      } else {
        Swal.fire({
          icon: "error",
          title: "Kamers overlappen",
          text: "Kamers mogen niet overlappen. Probeer opnieuw.",
        });
      }
    }

    setNewRectangle(null);
    setIsDrawing(false);
  };

  // const handleRectangleClick = (index: number) => {
  //   // const stage = stageRef.current;
  //   // const pointerPosition = stage.getPointerPosition();
  //   // const mouseX = (pointerPosition.x - stage.x()) / scale;
  //   // const mouseY = (pointerPosition.y - stage.y()) / scale;

  //   // const rect = rooms[index];

  //   // // You could check distances here based on the transformed mouse coordinates
  //   // const isInside =
  //   //   mouseX >= rect.x &&
  //   //   mouseX <= rect.x + rect.width &&
  //   //   mouseY >= rect.y &&
  //   //   mouseY <= rect.y + rect.height;

  //   // if (isInside) {
  //   //   setSelectedRectangleIndex(index);
  //   // }
  //   setSelectedRectangleIndex(index);
  // };
  const handleRectangleClick = (index: number) => {
    setSelectedRectangleIndex(index);
    setSelectedDeviceIndex(null); // Deselect any selected device
  };

  const handleDeviceClick = (index: number) => {
    console.log("Device clicked:", index);
    setSelectedDeviceIndex(index);
    console.log("Test", selectedDeviceIndex);
    setSelectedRectangleIndex(null); // Deselect any selected rectangle
    setSelectedDevice(vasteApparaten[index]); // Set the selected device to show its info if needed
  };

  const handleRectangleDoubleClick = (index: number) => {
    if (!isEditing) return;

    const rect = rooms[index];

    const roomName = prompt("Enter room name:");
    if (roomName) {
      const updatedRooms = rooms.map((rect, i) =>
        i === index ? { ...rect, text: roomName } : rect
      );
      setRooms(updatedRooms);
      historyRef.current.push(updatedRooms);
    }
  };
  // ... your existing imports and code above this line
  // Utility function to check if a device is within any room
  const isDeviceInsideRoom = (device: Rectangle, rooms: Rectangle[]) => {
    return rooms.some((room) => {
      return (
        device.x >= room.x &&
        device.x + device.width <= room.x + room.width &&
        device.y >= room.y &&
        device.y + device.height <= room.y + room.height
      );
    });
  };

  const handleDeleteKeyPress = (e: KeyboardEvent) => {
    if (!isEditing) return;

    if (e.key === "Delete") {
      console.log("Delete key pressed");
      console.log(selectedDeviceIndex);
      if (selectedRectangleIndex !== null) {
        //delete the room
        console.log("Room clicked for deletion:", selectedRectangleIndex);
        if (
          selectedRectangleIndex >= 0 &&
          selectedRectangleIndex < rooms.length
        ) {
          const updatedRooms = rooms.filter(
            (_, index) => index !== selectedRectangleIndex
          );
          setRooms(updatedRooms);
          historyRef.current.push(updatedRooms);

          // Reset selectedRectangleIndex if it's invalid now
          if (selectedRectangleIndex >= updatedRooms.length) {
            setSelectedRectangleIndex(null);
          }
        }
      } else if (selectedDeviceIndex !== null) {
        console.log("Device clicked for deletion:", selectedDeviceIndex);
        if (selectedDeviceIndex >= 0 && selectedDeviceIndex < devices.length) {
          const deviceToDelete = devices[selectedDeviceIndex];
          const updatedDevices = devices.filter(
            (_, index) => index !== selectedDeviceIndex
          );
          setDevices(updatedDevices);
          historyRef.current.push(updatedDevices);

          // Reset selectedDeviceIndex if it's invalid now
          if (selectedDeviceIndex >= updatedDevices.length) {
            setSelectedDeviceIndex(null);
          }

          // Restore the deleted device from vasteApparaten if necessary
          const deviceToAdd = vasteApparaten.find(
            (apparaat) => apparaat.id === deviceToDelete.id
          );
          if (deviceToAdd) {
            const updatedApparaten = [...apparaten, deviceToAdd];
            setApparaten(updatedApparaten);
          }
        }
      }
    }
  };

  // Gebruik useEffect om de Delete toets te koppelen aan de handleDeleteKeyPress functie
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleDeleteKeyPress(e);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRectangleIndex, rooms, selectedDeviceIndex]);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let newScale = e.evt.deltaY > 0 ? oldScale * 1.1 : oldScale / 1.1;
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    setScale(newScale);

    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleDeleteKeyPress);
    return () => {
      window.removeEventListener("keydown", handleDeleteKeyPress);
    };
  }, [selectedRectangleIndex]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // If we are saving the changes, generate the JSON
      const roomsJson = JSON.stringify(rooms, null, 2); // Pretty print the JSON
      const devicesJson = JSON.stringify(devices, null, 2); // Pretty print the JSON
      // Optionally, you could also log it to the console
      console.log("Rooms:", roomsJson);
      console.log("Devices:", devicesJson);
      updateplattegrond(roomsJson, devicesJson);
      // You can implement further logic to send this JSON to a server if needed
    } else {
      setNewRectangle(null);
    }
  };
  const isOverlapping = (rect1: Rectangle, rect2: Rectangle) => {
    return !(
      (
        rect1.x + rect1.width <= rect2.x || // rect1 is to the left of rect2
        rect1.x >= rect2.x + rect2.width || // rect1 is to the right of rect2
        rect1.y + rect1.height <= rect2.y || // rect1 is above rect2
        rect1.y >= rect2.y + rect2.height
      ) // rect1 is below rect2
    );
  };
  const handleDeviceDrop = (device: Apparaat, x: number, y: number) => {
    const deviceWidth = 80;
    const deviceHeight = 50;

    const containingRoom = rooms.find(
      (room) =>
        x >= room.x &&
        x <= room.x + room.width &&
        y >= room.y &&
        y <= room.y + room.height
    );

    if (!containingRoom) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Plaatst apparaat in een kamer",
      });
      return;
    }

    const newDeviceRectangle: Rectangle = {
      id: device.id,
      x: x - deviceWidth / 2,
      y: y - deviceHeight / 2,
      width: deviceWidth,
      height: deviceHeight,
      stroke: "blue",
      strokeWidth: 2,
      text: device.naam,
    };

    const updatedDevice: Apparaat = { ...device, KamerId: containingRoom.id }; // Update met roomId

    setDevices([...devices, newDeviceRectangle]);
    setApparaten((prevApparaten) =>
      prevApparaten.map((d) => (d.id === device.id ? updatedDevice : d))
    );

    console.log("Apparaat geplaatst in kamer met ID:", containingRoom.id);
  };

  // useEffect om `rooms` wijzigingen te loggen en te bevestigen
  useEffect(() => {
    console.log("rooms state gewijzigd:", rooms);
  }, [rooms]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const stage = stageRef.current;

    // Retrieve the current scale and position of the stage
    const scaleX = stage.scaleX();
    const scaleY = stage.scaleY();
    const stagePosition = stage.position();

    // Retrieve the pointer position within the stage
    const pointerPosition = {
      x: e.clientX - stage.container().getBoundingClientRect().left,
      y: e.clientY - stage.container().getBoundingClientRect().top,
    };

    // Calculate the drop position considering scale and stage offset
    const transformedPointerPosition = {
      x: (pointerPosition.x - stagePosition.x) / scaleX,
      y: (pointerPosition.y - stagePosition.y) / scaleY,
    };

    // Retrieve the device data from the drag event
    const deviceData = e.dataTransfer.getData("device");
    if (!deviceData) {
      console.log("Device data niet gevonden bij het droppen.");
      return;
    }

    const device = JSON.parse(deviceData);

    console.log(
      "Pointer positie (getransformeerd):",
      transformedPointerPosition
    );
    console.log("Device Data:", device);

    // Add the device at the calculated, transformed position
    handleDeviceDrop(
      device,
      transformedPointerPosition.x,
      transformedPointerPosition.y
    );
  };
  // const handleDeviceClick = (device: Apparaat, event: React.MouseEvent) => {
  //   const rect = event.target.getBoundingClientRect();
  //   setSelectedDevice(device);
  //   setPopupPosition({
  //     top: rect.top - 60, // Adjust as needed
  //     left: rect.left,
  //   });
  // };

  return (
    <>
      <h1 style={{ margin: "0 0 1vw 3vw", fontSize: "1.5em" }}>Plattegrond</h1>
      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            width: "75vw",
            height: "calc(100vh - 5vw)",
            margin: "0vw 0 5vw 1vw",
            padding: "0",
            overflow: "hidden",
            border: "1px solid black",
            boxSizing: "border-box",
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <button onClick={toggleEditMode}>
            {isEditing ? "Opslaan" : "Aanpassen"}
          </button>
          <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            ref={stageRef}
            scaleX={scale}
            scaleY={scale}
          >
            <Layer>
              {rooms.map((rect, index) => (
                <React.Fragment key={index}>
                  <Rect
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    stroke={rect.stroke}
                    strokeWidth={rect.strokeWidth}
                    onClick={() => handleRectangleClick(index)}
                    onDblClick={() => handleRectangleDoubleClick(index)}
                  />
                  {rect.text && (
                    <Text
                      x={rect.x + rect.width / 2}
                      y={rect.y + rect.height / 2}
                      text={rect.text}
                      fontSize={15}
                      fill="black"
                      align="center"
                      verticalAlign="middle"
                      offsetX={rect.width / 2}
                      offsetY={7.5}
                    />
                  )}
                </React.Fragment>
              ))}

              {newRectangle && (
                <Rect
                  x={newRectangle.x}
                  y={newRectangle.y}
                  width={newRectangle.width}
                  height={newRectangle.height}
                  stroke={newRectangle.stroke}
                  strokeWidth={newRectangle.strokeWidth}
                />
              )}

              {devices.map((device, index) => (
                <React.Fragment key={index}>
                  <Rect
                    x={device.x}
                    y={device.y}
                    width={device.width}
                    height={device.height}
                    stroke={device.stroke}
                    strokeWidth={device.strokeWidth}
                    onClick={() => handleDeviceClick(index)} // Set device information on click
                  />
                  {device.text && (
                    <Text
                      x={device.x + device.width / 2}
                      y={device.y + device.height / 2}
                      text={device.text}
                      fontSize={15}
                      fill="black"
                      align="center"
                      verticalAlign="middle"
                      offsetX={device.width / 2}
                      offsetY={7.5}
                    />
                  )}
                </React.Fragment>
              ))}
            </Layer>
          </Stage>
        </div>

        <div
          style={{
            width: "20vw",
            height: "calc(100vh - 5vw)",
            margin: "0 0 5vw 0",
            padding: "1vw",
            overflowY: "scroll",
            border: "1px solid black",
            boxSizing: "border-box",
          }}
        >
          <h2>Apparaten</h2>
          {apparaten.map((device) => (
            <div
              key={device.id}
              draggable={isEditing}
              onDragStart={(e) => {
                e.dataTransfer.setData("device", JSON.stringify(device));
              }}
              style={{
                width: 100,
                height: 50,
                backgroundColor: "lightgray",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "grab",
              }}
            >
              {device.naam}
            </div>
          ))}
          {selectedDevice && (
            <div
              style={{
                position: "absolute",
                top: popupPosition.top,
                left: popupPosition.left,
                backgroundColor: "white",
                border: "1px solid black",
                padding: "10px",
                zIndex: 1000,
              }}
            >
              {/* <h3>{selectedDevice.naam}</h3>
              <p>ID: {selectedDevice.id}</p>
              <p>Other info:</p> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Plattegrond;

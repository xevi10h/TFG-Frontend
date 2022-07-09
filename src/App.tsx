import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ValueConfiguration from "./pages/ValueConfiguration";
import DensityMap from "./pages/DensityMap";
import Expedition from "./classes/Expedition";
import Area from "./classes/Area";
import AddWarehouse from "./pages/AddWarehouse";
import Warehouse from "./classes/Warehouse";

function App() {
  const today = new Date().toISOString().split("T")[0];
  const [configValue, setConfigValue] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<string[]>([today, today]);
  const [volumeRange, setVolumeRange] = useState<Array<number | undefined>>([0, undefined]);
  const [weightRange, setWeightRange] = useState<Array<number | undefined>>([0, undefined]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              configValue={configValue}
              dateRange={dateRange}
              setDateRange={setDateRange}
              volumeRange={volumeRange}
              setVolumeRange={setVolumeRange}
              weightRange={weightRange}
              setWeightRange={setWeightRange}
            />
          }
        />
        <Route
          path="/valueConfiguration"
          element={<ValueConfiguration configValue={configValue} setConfigValue={(e: any) => setConfigValue(e)} />}
        />
        <Route
          path="/densityMap"
          element={
            <DensityMap
              configValue={configValue}
              dateRange={dateRange}
              volumeRange={volumeRange}
              weightRange={weightRange}
            />
          }
        />
        <Route
          path="/addWarehouse"
          element={
            <AddWarehouse areas={areas} setAreas={setAreas} warehouses={warehouses} setWarehouses={setWarehouses} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

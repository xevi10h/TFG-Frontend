import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ValueConfiguration from "./pages/ValueConfiguration";
import DensityMap from "./pages/DensityMap";
import Area from "./classes/Area";
import AddWarehouse from "./pages/AddWarehouse";
import Warehouse from "./classes/Warehouse";

function App() {
  const today = new Date().toISOString().split("T")[0];
  const [configValue, setConfigValue] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<string[]>([today, today]);
  const [volumeRange, setVolumeRange] = useState<Array<number | undefined>>([0, undefined]);
  const [weightRange, setWeightRange] = useState<Array<number | undefined>>([0, undefined]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [minRadius, setMinRadius] = useState<number>(0);

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
              setWarehouses={setWarehouses}
              warehouses={warehouses}
              configValue={configValue}
              dateRange={dateRange}
              volumeRange={volumeRange}
              weightRange={weightRange}
              setMinRadius={setMinRadius}
            />
          }
        />
        <Route
          path="/addWarehouse"
          element={<AddWarehouse minRadius={minRadius} setWarehouses={setWarehouses} warehouses={warehouses} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

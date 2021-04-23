import React, { ReactElement } from "react";
import "./style.css";

interface Props {
  hour: string;
  minute: string;
  amPm: string;
  setHour: (arg: string) => void;
  setMinute: (arg: string) => void;
  setAmPm: (arg: string) => void;
}

const ArrivalTime = (props: Props): ReactElement => {
  const { hour, minute, amPm, setHour, setMinute, setAmPm } = props;

  function onHourChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setHour(e.target.value);
  }

  function onMinuteChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setMinute(e.target.value);
  }

  function onAmPmChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setAmPm(e.target.value);
  }

  return (
    <div className="arrival">
      <span id="label">Arrive by:</span>
      <div id="input-div">
        <select value={hour} onChange={onHourChange}>
          <option value="1">01</option>
          <option value="2">02</option>
          <option value="3">03</option>
          <option value="4">04</option>
          <option value="5">05</option>
          <option value="6">06</option>
          <option value="7">07</option>
          <option value="8">08</option>
          <option value="9">09</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <span className="px-1">:</span>
        <select className="mr-2" value={minute} onChange={onMinuteChange}>
          <option value="0">00</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
        </select>
        <select value={amPm} onChange={onAmPmChange}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default ArrivalTime;

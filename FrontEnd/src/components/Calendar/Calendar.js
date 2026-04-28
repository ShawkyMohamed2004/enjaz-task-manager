import React, { useState, useEffect, useCallback } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";

const Calendar = () => {
  const [value, setValue] = useState(new Date());
  const [taskMap, setTaskMap] = useState({});
  const navigate = useNavigate();

  const fetchTasks = useCallback(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`${process.env.REACT_APP_API_URL}/task/getTask`)
      .then((res) => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const map = {};
        res.data
          .filter((t) => {
            if (!t.task || !t.task.deadline) return false;
            if (t.done === true) return false;
            const d = new Date(t.task.deadline);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          })
          .forEach((t) => {
            const dayNum = new Date(t.task.deadline).getDate();
            if (!map[dayNum]) map[dayNum] = [];
            map[dayNum].push(t.task.taskName || "Task");
          });
        setTaskMap(map);
      })
        .catch(() => {});
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Poll every 5 seconds as fallback
  useEffect(() => {
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  // Listen for instant task changes (add/delete/complete)
  useEffect(() => {
    const handleTaskChange = () => {
      // Small delay to let the API process the change
      setTimeout(fetchTasks, 500);
    };
    window.addEventListener('tasksChanged', handleTaskChange);
    return () => window.removeEventListener('tasksChanged', handleTaskChange);
  }, [fetchTasks]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        variant="static"
        orientation="portrait"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        slots={{
          day: (props) => {
            const dayNum = props.day.getDate();
            const tasksForDay = !props.outsideCurrentMonth ? taskMap[dayNum] : null;
            const hasTask = tasksForDay && tasksForDay.length > 0;

            const tooltipText = hasTask
              ? tasksForDay.map((name, i) => `${i + 1}. ${name}`).join("\n")
              : "";

            const dayElement = (
              <PickersDay
                {...props}
                onClick={(e) => {
                  if (hasTask) {
                    navigate("/Home/task");
                  }
                  if (props.onDaySelect) props.onDaySelect(props.day);
                }}
                sx={{
                  cursor: hasTask ? "pointer" : "default",
                  ...(hasTask && {
                    backgroundColor: "#FF6B35 !important",
                    color: "white !important",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#e55a2b !important" },
                  }),
                }}
              />
            );

            if (hasTask) {
              return (
                <Tooltip
                  key={props.day.toString()}
                  title={
                    <div style={{ whiteSpace: "pre-line", fontSize: "13px" }}>
                      <strong>{`${dayNum}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`}</strong>
                      {"\n"}{tooltipText}
                    </div>
                  }
                  arrow
                  placement="top"
                  enterDelay={0}
                  leaveDelay={0}
                  slotProps={{
                    tooltip: {
                      sx: { animation: 'none', transition: 'none !important' }
                    }
                  }}
                >
                  {dayElement}
                </Tooltip>
              );
            }

            return dayElement;
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default Calendar;

import React, { useEffect, useState } from "react";
import Greeting from "./Greeting";
import { Table } from "react-bootstrap";
import PopupWindow from "./PopupWindow";
import { icons } from "./Icon_pkg";
import { FcEmptyTrash, FcInspection } from "react-icons/fc";
import createNotification from "./reactNotification";
import moment from "moment/moment";
import {FiEdit} from "react-icons/fi"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function TodoList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectIcon, setselectIcon] = useState(null);
  const [enterTask, setenterTaskName] = useState("");
  const [discription,setdiscription]=useState("");
  const [filter, setFilter] = useState("All"); // initialize filter state to "All"
  const [taskList, setTaskList] = useState(
    // Load the task list from the local storage when the component is mounted
    JSON.parse(localStorage.getItem("taskList")) || []
  );

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    // Save the task list to the local storage when it changes
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }, [taskList]);
  const isValidString = function(value){
    if(!/^[A-Za-z ]{2,8}$/.test(value)) {return false}
    else return true
}

const isValidStringDiscription = function(value){
  if(!/^[A-Za-z ]{10,30}$/.test(value)) {return false}
  else return true
}
  const addTask = () => {
    
    if (enterTask &&discription&& selectIcon ) {
      const newTask = {
        id: Date.now(),
        title: enterTask,
        icon: selectIcon ? selectIcon.image : null,
        discription:discription,
        completed: false, // add a 'completed' property to the new task
        createdAt: moment().format("MMMM Do YYYY, h:mm a"), // add a createdAt property with the current date and time
      };

      setTaskList([...taskList, newTask]);
      setenterTaskName("");
      setselectIcon(null);
      setdiscription("")
      createNotification("success", "Task added.");
    }
  };
  console.log("enterTask---", enterTask);

  const deleteTask = (index) => {
    const newTaskList = [...taskList];
    newTaskList.splice(index, 1);
    setTaskList(newTaskList);
  };

  const completeTask = (id) => {

    const updatedTasks = taskList.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          completed: true, // update the 'completed' property of the selected task
        };
      }
      return task;
    });
    setTaskList(updatedTasks);
  };

  const filteredTasks = taskList.filter((task) => {
    if (filter === "All") {
      return true; // return all tasks if the filter is set to "All"
    } else if (filter === "Complete") {
      return task.completed; // return only completed tasks if the filter is set to "Complete"
    } else if (filter === "Incomplete") {
      return !task.completed; // return only incomplete tasks if the filter is set to "Incomplete"
    }
  });

  const handleFilterChange = (e) => {
    setFilter(e.target.value); // update filter state when the select box changes
  };

  const showSelectedIcon = (icon) => {
    setselectIcon(icon);
    setIsModalOpen(false);
    if (!enterTask) {
      createNotification("error", "Please enter project Name.");
      return;
  
    }else if(!discription){
       createNotification("error","Please enter discription")
       return
    }else if(!isValidStringDiscription(discription)){
     createNotification("error","Invaild discription should be 8 to 30 words")
     return ;
    }else{
        addTask();
    }
  };
 

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
 const [editdata,setedit]=useState({})

  const updateTask=()=>{
    if(discription){
      if(!isValidStringDiscription(discription)){
        createNotification("error","Invaild discription should be 8 to 30 words")
        return ;
      }
    }
    const updatedTasks = taskList.map((task) => {
      if (task.id === editdata?.id) {
        let obj={...task,}
        if(enterTask){
          obj["title"]=enterTask
        }
        if(discription){
          obj["discription"]=discription
        }
        return obj;
      }
      return task;
    });
    setTaskList(updatedTasks);
    handleClose();
    setdiscription("");
    setenterTaskName("")
  }
  console.log("taskList=====>", taskList);
  return (
    <div style={{ backgroundColor: "beige" }}>
      <div className="head">
        <h3
          className="p-3"
          style={{ color: "#013456", fontWeight: 700, fontSize: "35px" }}
        >
          <FcInspection /> To Do
        </h3>
      </div>
      <hr />
      <div className="container">
        <Greeting />
        <div className="row">
          <div className="col-md-6">
            <div className="add-todo">
              <div className="m-3 ">
                <input
                  className="text-box"
                  placeholder="project name"
                 
                  onChange={(e) => setenterTaskName(e.target.value)}
                />
                <br/><br/>
                     <input
                  className="text-box"
                  placeholder="Same discription"
                
                  onChange={(e) => setdiscription(e.target.value)}
                />
              </div>{" "}
              <div className="button-style">
                <button
                  className="add_btn"
                  title="Add"
                  onClick={() => {
                    !selectIcon ? handleModalOpen() : addTask();
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="add-icon">
              {/* <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 400 }}
            overlay={renderTooltip}
          > */}
              {/* <span>
                {" "}
                <i
                  title="Add Icon's"
                  class="fa-solid fa-circle-plus show-text-onHover"
                  style={{ cursor: "pointer" }}
                  onClick={handleModalOpen}
                ></i>
              </span> */}
              {selectIcon && (
                <span>
                  <img
                    className="icon0"
                    src={selectIcon.image}
                    alt="loading"
                    title={selectIcon.name}
                  />
                </span>
              )}

              {/* </OverlayTrigger> */}
            </div>
            <div className="model-popup m-3">
              {isModalOpen && (
                <PopupWindow onClose={handleModalClose}>
                  <div className="row">
                    {icons.map((data) => (
                      <div className="col-2 p-1">
                        <img
                          className="icon1"
                          src={data.image}
                          alt="loading"
                          title={data.name}
                          onClick={() => showSelectedIcon(data)}
                        />
                      </div>
                    ))}
                  </div>
                </PopupWindow>
              )}
            </div>
          </div>
          <div className="col-md-6 clm-top">
            <div className="filter-type">
              <label htmlFor="filter">Filter by:</label>{" "}
              <select
                className="select-option"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="All">All</option>
                <option value="Complete">Complete</option>
                <option value="Incomplete">Incomplete</option>
              </select>
            </div>
            <div className="table-data mb-3">
              <Table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th style={{ paddingLeft: "45px" }}>Task</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.reverse().map((task, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          class="larger-checkbox"
                          checked={task.completed} // determine whether the checkbox should be checked
                          onChange={() => completeTask(task.id)} // call the completeTask function when the checkbox is changed
                        />
                      </td>
                      <td>
                        <img src={task?.icon} alt="" className="table-image" />{" "}
                        <span>{task.title}</span>
                        <p>{task?.discription}.</p>
                        <p
                          className="ms-4"
                          style={{
                            fontSize: "10px",
                            color: "black",
                          }}
                        >
                          <i>{task.createdAt}</i>
                        </p>{" "}
                        {/* display the relative timestamp */}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <FiEdit   style={{ fontSize: "27px", cursor: "pointer" }} onClick={()=>{
                          setedit(task)
                          handleShow()
                        }}/>{" "}
                        <FcEmptyTrash
                          title="Delete"
                          style={{ fontSize: "27px", cursor: "pointer" }}
                          onClick={() => deleteTask(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="ff-0">
                        <form>
                            <div className="de mb-2">
                                <input type="text" className="differ" placeholder={editdata?.title} onChange={(e)=>setenterTaskName(e.target.value)}/>
                            </div>
                            <div className="de mb-2">
                                <textarea style={{ height: "80px" }} className="differ" placeholder={editdata?.discription} onChange={(e)=>setdiscription(e.target.value)}/>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="secondary" onClick={handleClose}>
        Close
      </Button> */}
                    <Button variant="primary" onClick={updateTask}  style={{backgroundColor:"#ec2323",border:"1px solid #ec2323"}}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
    </div>
  );
}

export default TodoList;

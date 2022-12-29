import React, { useState,useContext, useEffect, useRef } from 'react'
import notesContext from "../context/notes/noteContext";
import Noteitem from './Noteitem';
import Addnote from './Addnote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
  const navigate = useNavigate();
  const ref = useRef(null)
  const ref2 = useRef(null)
  const context = useContext(notesContext);
  const { notes, getNotes,editNote } = context

  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes();
    }else{
      navigate('/login')
    }
   
  }, [])

  const [note, setNote] = useState({id: " ", etitle: " ", edescription: " ",etag: " "})
  
  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id:currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag});
  }
  

  const onChange =  (event) =>{
        setNote({...note, [event.target.name]: event.target.value })
  }

  const handleClick = (e) =>{
    editNote(note.id,note.etitle,note.edescription,note.etag)
    ref.current.click();
    props.showAlert("Note Updated Successfully","success")
}

  
  return (
    <>
      <Addnote showAlert={props.showAlert}/>
      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch static backdrop modal
      </button>

      <div className="modal fade" id="exampleModal"  tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <form>
                    <div className="mb-3">
                        <label htmlFor="etitle" className="form-label">Title </label>
                        <input type="text" className="form-control" id="etitle" value={note.etitle} minLength={5} required name='etitle' aria-describedby="emailHelp"onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="edescription" className="form-label">Description</label>
                        <input type="text" className="form-control"  name='edescription' id="edescription" minLength={5} required value={note.edescription} onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="etag" className="form-label">Tag</label>
                        <input type="text" className="form-control"  name='etag' id="etag" value={note.etag} onChange={onChange}  />
                    </div>
                </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref={ref2}  className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button"  disabled={note.etitle.length<5 || note.edescription.length<5} className="btn btn-primary"  onClick={handleClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container">
        {notes.length===0 && 'No Notes To Display'}
        </div>
        {notes.map((note) => {
                    return <Noteitem key={note._id} updateNote={updateNote} note={note} />
                })}
        {/* {notes.map((note) => {
          return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
        })
        } */}
      </div>
    </>
  )
}

export default Notes
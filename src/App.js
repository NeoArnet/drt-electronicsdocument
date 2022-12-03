import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import swal from 'sweetalert';

function App() {
  const [newlist, setnewlist] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [txttitle, setitle] = useState("");
  const [getid, setid] = useState();
  const [txtdetail, setdetail] = useState("");
  const [txtstatus, settxtstatus] = useState();

  const showmodel = async (i, e, v, s) => {
    setShow(true);
    setid(i);
    setitle(e);
    setdetail(v);
    settxtstatus(s);
  };

  const checkStatus = async (id, e) => {
    settxtstatus(e.target.checked);

    const form = new FormData();
    form.append('EmployeeId', 3)
    form.append('NewsId', id)
    form.append('Status', (e.target.checked===true? 1: 0))
    
    await axios
      .post(
        `/drt-ElectronicsDocument/ED-UpdateStatusNews`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      .then(async (re) => {
        if (re.data.successful === true) {
          setShow(false);
          //alert("seccessful");
          swal("บันทึกสถานะ", "บันทึกสถานะเรียบร้อยแล้ว", "success");
            getnewlist();
        }
        
         
      });
  };

  const getnewlist = async () => {
    await axios
      .get(
        `/drt-ElectronicsDocument/ED-GetNews?EmployeeId=3`
      )
      .then(async (re) => {
        setnewlist(re.data.data);
      });
  };

  useEffect(() => {
    getnewlist();
  });

  return (
    <>
      <div className="m-3">
        <div className="d-flex justify-content-center">
          <h4>ข่าวประชาสัมพันธ์</h4>
        </div>
        <div className="d-flex justify-content-left">
          <Button variant="success">+ สร้างข่าว</Button>
        </div>
        <p>รายการข่าวประชาสัมพันธ์</p>
        <Table striped hover size="sm">
          <thead className="p-3 mb-2 bg-primary text-white">
            <tr>
              <th></th>
              <th>ลำดับ</th>
              <th>ชื่อเรื่อง</th>
              <th>วันที่สร้าง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {newlist.map((item) => (
              <tr>
                <th>
                  <Form.Check
                    type="switch"
                    checked={item.Status}
                    onChange={(e) => checkStatus(item.NewsId, e)}
                  />
                </th>
                <td>{item.NewsId}</td>
                <td>{item.NameNews}</td>
                <td>
                  {moment(item.UpdatedDate)
                    .add(543, "years")
                    .format("DD/MM/YYYY")}
                </td>
                <td>
                  {item.ButtonView === 1 ? (
                    <Badge
                      bg="info"
                      onClick={() =>
                        showmodel(
                          item.NewsId,
                          item.NameNews,
                          item.Detail,
                          item.Status
                        )
                      }
                    >
                      View
                    </Badge>
                  ) : (
                    ""
                  )}{" "}
                  {item.ButtonEdit === 1 ? (
                    <Badge bg="success">Edit</Badge>
                  ) : (
                    ""
                  )}{" "}
                  {item.ButtonDelete === 1 ? (
                    <Badge bg="danger">Delete</Badge>
                  ) : (
                    ""
                  )}{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="p-3 mb-2 bg-primary text-white">
          <Modal.Title>รายละเอียดข่าวประชาสัมพันธ์</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ชื่อเรื่อง :</Form.Label>
              <Form.Control type="text" disabled={true} value={txttitle} />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>เนื้อหา :</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                disabled={true}
                value={txtdetail}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>สถานะ :</Form.Label>
              <Form.Check
                type="switch"
                id="custom-switch"
                checked={txtstatus}
                onChange={(e) => checkStatus(getid, e)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;

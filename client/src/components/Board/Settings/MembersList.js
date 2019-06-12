  import React, { useState, useEffect } from 'react';
  import { SERVER_URL } from './../../../config';
  import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Switch,
    Paper,
    CircularProgress
  } from '@material-ui/core';
  import './settings.css';
  import './../../../App.css';
  import axios from 'axios';
  import { useSnackBar } from './../../../customHooks';
  import Icon from '@material-ui/core/Icon';
  import Modal from './../../CommonComponents/Modal';
  import Button from './../../Button';
  import constants from './../../../constants';

  const MemberList = function(props) {
    const [members, setMembers] = useState([]);
    const [showLoader, setShowLoader] = useState(true);
    const { openSnackBar } = useSnackBar();
    const [ openConfirmationModal, setOpenConfirmationModal ] = useState(false);
    const [ memberToBeDelete, setMemberToBeDelete ] = useState({});
    const { SUPER_ADMIN, ADMIN, USER } = constants.ROLES;

    useEffect(() => {
      fetchBoardMembers();
    }, [props]);

    async function fetchBoardMembers() {
      try {
        const result = await axios(SERVER_URL + "/board/members/86");
        setMembers(result.data.data);
        setShowLoader(false);
      }
      catch(error){
        const { isSuccess, message } = error.response.data;
        if (!isSuccess) {
          openSnackBar('error', message);
        }
      }
    }

    const updateBoardMember = async data => {
      try {
        const response = await axios({
          url: `${SERVER_URL}/board/member/86`,
          method: "patch",
          data
        });
        const { isSuccess, message } = response.data;
        openSnackBar('success', message);
        fetchBoardMembers();
      }
      catch(error){
        const { isSuccess, message } = error.response.data;
        if (!isSuccess) {
          openSnackBar('error', message);
        }
      }
    };

    const setMemberRole = (isChecked, index) => {
      const boardMembers = Object.assign([], members);
      boardMembers[index].role = isChecked ? ADMIN : USER;

      setMembers(boardMembers);
      updateBoardMember({
        role: boardMembers[index].role,
        member: boardMembers[index].user._id
      });
    };

    const handleMemberDelete = async() => {
      setShowLoader(true);
      closeConfirmationModal();
      try {
      const result = await axios({
        url: SERVER_URL + "/board/member/86",
        method: 'delete',
        data: {member: memberToBeDelete._id}
      });  
      fetchBoardMembers();
    }
    catch(error){
      const { isSuccess, message } = error.response.data;
      if (!isSuccess) {
        setShowLoader(false);
        openSnackBar('error', message);
      }
    }
    }

    const openConfirmationDialog = (member) => {
      setMemberToBeDelete(member);
      setOpenConfirmationModal(true);
    }

    const closeConfirmationModal = () => {
      setOpenConfirmationModal(false);
    }
    return showLoader ? (
      <CircularProgress className="loader-center" />
    ) : (
      <div className="member-table">
        <Paper>
          <Typography variant="h6" id="tableTitle" className="table-heading">
            Board Members
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Update Role</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((row, index) => {
                 row.switch = row.role === ADMIN;
                return (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.user.name}
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={row.role} color="primary" />
                    </TableCell>
                    <TableCell align="center">
                      {row.role !== SUPER_ADMIN && (
                        <Switch
                          checked={row.switch}
                          onChange={event => {
                            setMemberRole(event.target.checked, index);
                          }}
                          value="roleSwitch"
                          color="primary"
                          inputProps={{ "aria-label": "primary checkbox" }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                    {row.role !== SUPER_ADMIN && (
                        <Icon style={{cursor: 'pointer'}} onClick={()=>{
                          openConfirmationDialog(row.user);
                        }}>delete</Icon>
                    )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>

        <DeleteModal user={memberToBeDelete} 
            openModal={openConfirmationModal} 
            onClose={closeConfirmationModal}
            onConfirm={handleMemberDelete}
            />
      </div>
    );
  };

  const DeleteModal = ({user, openModal, onClose, onConfirm}) => {
    return (
      <Modal
        open={openModal}
        handleClose={onClose}
        width="500px"
        title="Confirm Delete"
        >
          <p><Icon>warning</Icon> Are you sure you want to delete member '{user.name}'</p>
            <div style={{ marginTop: "10px" }}>
            <div className="float-right">
              <Button
                type="submit"
                onClick = {onConfirm}
              >
                Confirm
              </Button>
            </div>
            <div className="float-right">
              <Button onClick={onClose}>No</Button>
            </div>
          </div>
    </Modal>);
  }
  export default MemberList;

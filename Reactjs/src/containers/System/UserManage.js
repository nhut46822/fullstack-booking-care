import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';

import { emitter } from '../../utils/emitter';

import {
	getAllUsers,
	createNewUserService,
	deleteUserService,
	editUserService,
} from '../../services/userService';

class UserManage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			arrUsers: [],
			isOpenModalUser: false,
			isOpenModalEditUser: false,
			userEdit: {},
		};
	}

	async componentDidMount() {
		await this.getAllUsersFromReact();
	}

	getAllUsersFromReact = async () => {
		let response = await getAllUsers('ALL');
		if (response && response.errCode === 0) {
			this.setState(
				{
					arrUsers: response.users,
				},
				() => {
					console.log('check ArrUser 2', this.state.arrUsers);
				}
			);
		}
	};

	handleAddNewUser = (response) => {
		this.setState({
			isOpenModalUser: true,
		});
	};

	toggleUserModal = () => {
		this.setState({
			isOpenModalUser: !this.state.isOpenModalUser,
		});
	};

	toggleUserEditModal = () => {
		this.setState({
			isOpenModalEditUser: !this.state.isOpenModalEditUser,
		});
	};

	createNewUser = async (data) => {
		try {
			let response = await createNewUserService(data);
			console.log('check response create new user: ', response);
			if (response && response.errCode !== 0) {
				alert(response.errMessage);
			} else {
				await this.getAllUsersFromReact();
				this.setState({
					isOpenModalUser: false,
				});
				emitter.emit('EVENT_CLEAR_MODAL_DATA', { id: 'your id' });
			}
		} catch (error) {
			console.log(error);
		}
	};

	handleDeleteUser = async (user) => {
		console.log('Click delete', user);
		try {
			let res = await deleteUserService(user.id);
			if (res && res.errCode === 0) {
				await this.getAllUsersFromReact();
			} else {
				alert(res.errMessage);
			}
		} catch (error) {
			console.log(error);
		}
	};

	handleEditUser = (user) => {
		console.log('check edit user', user);

		this.setState({
			isOpenModalEditUser: true,
			userEdit: user,
		});
	};

	doEditUser = async (user) => {
		try {
			let res = await editUserService(user);
			if (res && res.errCode === 0) {
				this.setState({
					isOpenModalEditUser: false,
				});
				await this.getAllUsersFromReact();
			} else {
				alert(res.errCode);
			}
		} catch (error) {
			console.log(error);
		}
	};

	render() {
		let arrUsers = this.state.arrUsers;

		return (
			<div className="users-container">
				<ModalUser
					isOpen={this.state.isOpenModalUser}
					toggleFromParent={this.toggleUserModal}
					createNewUser={this.createNewUser}
				/>
				{this.state.isOpenModalEditUser && (
					<ModalEditUser
						isOpen={this.state.isOpenModalEditUser}
						toggleFromParent={this.toggleUserEditModal}
						currentUser={this.state.userEdit}
						editUser={this.doEditUser}
					/>
				)}
				<div className="title text-center">Manage users with Eric</div>
				<div className="mx-1">
					<button
						className="btn btn-primary px-3 "
						onClick={() => this.handleAddNewUser()}
					>
						<i className="fas fa-plus"></i>
						Add new user
					</button>
				</div>

				<div className="users-table mt-3 mx-1">
					<table id="customers">
						<tbody>
							<tr>
								<th>Email</th>
								<th>First name</th>
								<th>Last name</th>
								<th>Address</th>
								<th>Action</th>
							</tr>

							{arrUsers &&
								arrUsers.map((item, index) => {
									return (
										<tr key={index}>
											<td>{item.email}</td>
											<td>{item.firstName}</td>
											<td>{item.lastName}</td>
											<td>{item.address}</td>
											<td>
												<button
													className="btn-edit"
													onClick={() =>
														this.handleEditUser(
															item
														)
													}
												>
													<i className="fas fa-pencil-alt"></i>
												</button>
												<button
													className="btn-delete"
													onClick={() =>
														this.handleDeleteUser(
															item
														)
													}
												>
													<i className="fas fa-trash"></i>
												</button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);

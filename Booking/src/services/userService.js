import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
	return new Promise(async (resolve, reject) => {
		try {
			let hashPassword = await bcrypt.hashSync(password, salt);
			resolve(hashPassword);
		} catch (e) {
			reject(e);
		}
	});
};

let handleUserLogin = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			let userData = {};
			let isExist = await checkUserEmail(email);
			if (isExist) {
				// user already exist
				// compare password
				let user = await db.User.findOne({
					where: { email: email },
					raw: true,

					attributes: [
						'email',
						'roleId',
						'password',
						'firstName',
						'lastName',
					],
				});
				if (user) {
					let check = bcrypt.compareSync(password, user.password);
					// let check = true;
					console.log('user', user);
					if (check) {
						userData.errCode = 0;
						userData.errMessage = 'Ok';
						delete user.password;
						userData.user = user;
					} else {
						userData.errCode = 3;
						userData.errMessage = 'Wrong password';
					}
				} else {
					userData.errCode = 2;
					userData.errMessage = "User's not found";
				}
				// resolve(userData);
			} else {
				userData.errCode = 1;
				userData.errMessage =
					"Your Email isn't exist in my system. Please try other email";
			}
			resolve(userData);
		} catch (error) {
			reject(error);
		}
	});
};

let checkUserEmail = (userEmail) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await db.User.findOne({
				where: { email: userEmail },
			});
			if (user) {
				resolve(true);
			} else {
				resolve(false);
			}
		} catch (error) {
			reject(error);
		}
	});
};

let getAllUsers = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let users = 'abc';
			if (userId === 'ALL') {
				users = await db.User.findAll({
					attributes: {
						exclude: ['password'],
					},
				});
			}
			if (userId && userId !== 'ALL') {
				users = await db.User.findOne({
					where: { id: userId },
					attributes: {
						exclude: ['password'],
					},
				});
			}
			resolve(users);
		} catch (error) {
			reject(error);
		}
	});
};

let createNewUser = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			// check email isn't exist
			let check = await checkUserEmail(data.email);

			if (check) {
				resolve({
					errCode: 1,
					errMessage: `Your Email is already used. Please try another email`,
				});
			} else {
				let hashPasswordFromBcrypt = await hashUserPassword(
					data.password
				);
				await db.User.create({
					email: data.email,
					password: hashPasswordFromBcrypt,
					firstName: data.firstName,
					lastName: data.lastName,
					address: data.address,
					phonenumber: data.phonenumber,
					gender: data.gender,
					roleId: data.roleId,
					positionId: data.positionId,
					image: data.avatar,
				});
				resolve({
					errCode: 0,
					message: 'Ok',
				});
			}
		} catch (error) {
			reject(e);
		}
	});
};

let deleteUser = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await db.User.findOne({
				where: { id: userId },
			});

			if (!user) {
				resolve({
					errCode: 2,
					errMessage: `The user isn't exist`,
				});
			}

			await db.User.destroy({ where: { id: userId } });
			// await user.destroy();
			resolve({
				errCode: 0,
				message: 'The user is deleted!',
			});
		} catch (error) {
			reject(error);
		}
	});
};

let updateUserData = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.id || !data.roleId || !data.positionId || !data.gender) {
				resolve({
					errCode: 2,
					errMessage: 'Missing required parameters!',
				});
			}
			let user = await db.User.findOne({
				where: { id: data.id },
				raw: false,
			});
			if (user) {
				// await user.update({
				// 	firstName: data.firstName,
				// 	lastName: data.lastName,
				// 	address: data.address,
				// });
				user.firstName = data.firstName;
				user.lastName = data.lastName;
				user.address = data.address;
				user.roleId = data.roleId;
				user.positionId = data.positionId;
				user.gender = data.gender;
				user.phonenumber = data.phonenumber;
				if (data.avatar) {
					user.image = data.avatar;
				}

				await user.save();

				resolve({
					errCode: 0,
					message: 'Update user successfully!',
				});
			} else {
				resolve({
					errCode: 1,
					errMessage: `User's not found!`,
				});
			}
		} catch (error) {
			reject(error);
		}
	});
};

let getAllCodeService = (typeInput) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!typeInput) {
				resolve({
					errCode: 1,
					errMessage: 'Missing required parameters!',
				});
			} else {
				let res = {};
				let allcode = await db.Allcode.findAll({
					where: { type: typeInput },
				});
				res.errCode = 0;
				res.data = allcode;
				resolve(res);
			}
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	handleUserLogin,
	getAllUsers,
	createNewUser,
	deleteUser,
	updateUserData,
	getAllCodeService,
};

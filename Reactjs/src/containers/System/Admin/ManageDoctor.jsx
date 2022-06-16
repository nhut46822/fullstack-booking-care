import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import * as actions from '../../../store/actions';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// save to Markdown table
			contentMarkdown: '',
			contentHTML: '',
			selectedDoctor: '',
			description: '',
			listDoctors: [],
			hasOldData: false,

			listPrice: [],
			listPayment: [],
			listProvince: [],

			// save to doctor_infor table
			selectedPrice: '',
			selectedPayment: '',
			selectedProvince: '',
			nameClinic: '',
			addressClinic: '',
			note: '',
		};
	}

	componentDidMount() {
		this.props.fetchAllDoctors();
		this.props.getAllRequiredDoctorInfor();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.allDoctors !== this.props.allDoctors) {
			let dataSelect = this.buildDataInputSelect(
				this.props.allDoctors,
				'USERS'
			);
			this.setState({
				listDoctors: dataSelect,
			});
		}

		if (
			prevProps.allRequiredDoctorInfor !==
			this.props.allRequiredDoctorInfor
		) {
			let { resPayment, resPrice, resProvince } =
				this.props.allRequiredDoctorInfor;

			let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
			let dataSelectPayment = this.buildDataInputSelect(
				resPayment,
				'PAYMENT'
			);
			let dataSelectProvince = this.buildDataInputSelect(
				resProvince,
				'PROVINCE'
			);

			// console.log(
			// 	'>>>check data new: ',
			// 	dataSelectPrice,
			// 	dataSelectPayment,
			// 	dataSelectProvince
			// );

			this.setState({
				listPrice: dataSelectPrice,
				listPayment: dataSelectPayment,
				listProvince: dataSelectProvince,
			});
		}

		if (prevProps.language !== this.props.language) {
			let dataSelect = this.buildDataInputSelect(
				this.props.allDoctors,
				'USERS'
			);
			let { resPayment, resPrice, resProvince } =
				this.props.allRequiredDoctorInfor;

			let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
			let dataSelectPayment = this.buildDataInputSelect(
				resPayment,
				'PAYMENT'
			);
			let dataSelectProvince = this.buildDataInputSelect(
				resProvince,
				'PROVINCE'
			);

			this.setState({
				listDoctors: dataSelect,
				listPrice: dataSelectPrice,
				listPayment: dataSelectPayment,
				listProvince: dataSelectProvince,
			});
		}
	}

	handleEditorChange = ({ html, text }) => {
		this.setState({
			contentMarkdown: text,
			contentHTML: html,
		});
	};

	handleSaveContentMarkdown = () => {
		let { hasOldData } = this.state;

		this.props.saveDetailDoctor({
			contentHTML: this.state.contentHTML,
			contentMarkdown: this.state.contentMarkdown,
			description: this.state.description,
			doctorId: this.state.selectedDoctor.value,
			action: hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

			selectedPrice: this.state.selectedPrice.value,
			selectedPayment: this.state.selectedPayment.value,
			selectedProvince: this.state.selectedProvince.value,
			nameClinic: this.state.nameClinic,
			addressClinic: this.state.addressClinic,
			note: this.state.note,
		});
		console.log('hoidanit check state: ', this.state);
	};

	handleChangeSelectDoctorInfor = async (selectedOption, name) => {
		let stateName = name.name;

		let stateCopy = { ...this.state };
		stateCopy[stateName] = selectedOption;

		this.setState({
			...stateCopy,
		});

		console.log(
			'hoi dan it channel check new select on change: ',
			selectedOption,
			stateName
		);
	};

	handleChangeSelect = async (selectedDoctor) => {
		this.setState({ selectedDoctor });
		let res = await getDetailInforDoctor(selectedDoctor.value);

		if (res && res.errCode === 0 && res.data && res.data.Markdown) {
			let markdown = res.data.Markdown;
			this.setState({
				contentHTML: markdown.contentHTML,
				contentMarkdown: markdown.contentMarkdown,
				description: markdown.description,
				hasOldData: true,
			});
		} else {
			this.setState({
				contentHTML: '',
				contentMarkdown: '',
				description: '',
				hasOldData: false,
			});
		}

		console.log('hoi dan itchannel: ', res);
	};

	handleOnChangeText = (event, id) => {
		let stateCopy = { ...this.state };
		stateCopy[id] = event.target.value;
		this.setState({ ...stateCopy });
	};

	buildDataInputSelect = (inputData, type) => {
		let result = [];
		let { language } = this.props;

		if (inputData && inputData.length > 0) {
			if (type === 'USERS') {
				inputData.map((item, index) => {
					let object = {};
					let labelVi = `${item.lastName} ${item.firstName}`;
					let labelEn = `${item.firstName} ${item.lastName}`;
					object.label =
						language === LANGUAGES.VI ? labelVi : labelEn;
					object.value = item.id;
					result.push(object);
				});
			}
			if (type === 'PRICE') {
				inputData.map((item, index) => {
					let object = {};
					let labelVi = `${item.valueVi}`;
					let labelEn = `${item.valueEn} USD`;
					object.label =
						language === LANGUAGES.VI ? labelVi : labelEn;
					object.value = item.keyMap;
					result.push(object);
				});
			}

			if (type === 'PAYMENT' || type === 'PROVINCE') {
				inputData.map((item, index) => {
					let object = {};
					let labelVi = `${item.valueVi}`;
					let labelEn = `${item.valueEn}`;
					object.label =
						language === LANGUAGES.VI ? labelVi : labelEn;
					object.value = item.keyMap;
					result.push(object);
				});
			}
		}

		return result;
	};

	render() {
		let { hasOldData } = this.state;

		console.log('check state: ', this.state);

		return (
			<div className="manage-doctor-container">
				<div className="manage-doctor-title">
					<FormattedMessage id="admin.manage-doctor.title" />
				</div>
				<div className="more-infor form-group">
					<div className="content-left">
						<label htmlFor="">
							<FormattedMessage id="admin.manage-doctor.select-doctor" />
						</label>
						<Select
							value={this.state.selectedDoctor}
							onChange={this.handleChangeSelect}
							options={this.state.listDoctors}
							placeholder={
								<FormattedMessage id="admin.manage-doctor.select-doctor" />
							}
						/>
					</div>
					<div className="content-right">
						<label htmlFor="">
							<FormattedMessage id="admin.manage-doctor.intro" />
						</label>
						<textarea
							className="form-control"
							onChange={(event) =>
								this.handleOnChangeText(event, 'description')
							}
							value={this.state.description}
						></textarea>
					</div>
				</div>

				<div className="more-infor-extra row">
					<div className="col-4 form-group">
						<label>
							<FormattedMessage id="admin.manage-doctor.price" />
						</label>
						<Select
							value={this.state.selectedPrice}
							onChange={this.handleChangeSelectDoctorInfor}
							options={this.state.listPrice}
							placeholder={
								<FormattedMessage id="admin.manage-doctor.price" />
							}
							name={'selectedPrice'}
						/>
					</div>
					<div className="col-4 form-group">
						<label>
							<FormattedMessage id="admin.manage-doctor.payment" />
						</label>
						<Select
							value={this.state.selectedPayment}
							onChange={this.handleChangeSelectDoctorInfor}
							options={this.state.listPayment}
							placeholder={
								<FormattedMessage id="admin.manage-doctor.payment" />
							}
							name={'selectedPayment'}
						/>
					</div>
					<div className="col-4 form-group">
						<label>
							<FormattedMessage id="admin.manage-doctor.province" />
						</label>
						<Select
							value={this.state.selectedProvince}
							onChange={this.handleChangeSelectDoctorInfor}
							options={this.state.listProvince}
							placeholder={
								<FormattedMessage id="admin.manage-doctor.province" />
							}
							name={'selectedProvince'}
						/>
					</div>
					<div className="col-4 form-group">
						<label>
							<FormattedMessage id="admin.manage-doctor.nameClinic" />
						</label>
						<input
							type="text"
							className="form-control"
							onChange={(event) =>
								this.handleOnChangeText(event, 'nameClinic')
							}
							value={this.state.nameClinic}
						/>
					</div>
					<div className="col-4 form-group">
						<label>
							<FormattedMessage id="admin.manage-doctor.addressClinic" />
						</label>
						<input
							type="text"
							className="form-control"
							onChange={(event) =>
								this.handleOnChangeText(event, 'addressClinic')
							}
							value={this.state.addressClinic}
						/>
					</div>
					<div className="col-4 form-group">
						<label>
							<FormattedMessage id="admin.manage-doctor.note" />
						</label>
						<input
							type="text"
							className="form-control"
							onChange={(event) =>
								this.handleOnChangeText(event, 'note')
							}
							value={this.state.note}
						/>
					</div>
				</div>

				<div className="manage-doctor-editor">
					<MdEditor
						style={{ height: '500px' }}
						renderHTML={(text) => mdParser.render(text)}
						onChange={this.handleEditorChange}
						value={this.state.contentMarkdown}
					/>
				</div>
				<button
					className={
						hasOldData
							? 'save-content-doctor'
							: 'create-content-doctor'
					}
					onClick={() => this.handleSaveContentMarkdown()}
				>
					{hasOldData ? (
						<span>
							<FormattedMessage id="admin.manage-doctor.save" />
						</span>
					) : (
						<span>
							<FormattedMessage id="admin.manage-doctor.add" />
						</span>
					)}
				</button>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		language: state.app.language,
		allDoctors: state.admin.allDoctors,
		allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
		getAllRequiredDoctorInfor: () =>
			dispatch(actions.getRequiredDoctorInfor()),
		saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);

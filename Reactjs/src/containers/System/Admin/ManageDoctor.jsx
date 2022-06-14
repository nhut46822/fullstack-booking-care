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

		if (prevProps.language !== this.props.language) {
			let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
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

			let dataSelectPrice = this.buildDataInputSelect(resPrice);
			let dataSelectPayment = this.buildDataInputSelect(resPayment);
			let dataSelectProvince = this.buildDataInputSelect(resProvince);

			console.log(
				'>>>check data new: ',
				dataSelectPrice,
				dataSelectPayment,
				dataSelectProvince
			);

			this.setState({
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
		});
		console.log('hoidanit check state: ', this.state);
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

	handleOnChangeDesc = (event) => {
		this.setState({ description: event.target.value });
	};

	buildDataInputSelect = (inputData, type) => {
		let result = [];
		let { language } = this.props;
		if (inputData && inputData.length > 0) {
			inputData.map((item, index) => {
				let object = {};
				let labelVi =
					type === 'USERS'
						? `${item.lastName} ${item.firstName}`
						: item.valueVi;
				let labelEn =
					type === 'USERS'
						? `${item.firstName} ${item.lastName}`
						: item.valueEn;
				object.label = language === LANGUAGES.VI ? labelVi : labelEn;
				object.value = item.id;
				result.push(object);
			});
		}

		return result;
	};

	render() {
		let { hasOldData } = this.state;

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
							placeholder={'Chọn bác sĩ'}
						/>
					</div>
					<div className="content-right">
						<label htmlFor="">
							<FormattedMessage id="admin.manage-doctor.intro" />
						</label>
						<textarea
							className="form-control"
							onChange={(event) => this.handleOnChangeDesc(event)}
							value={this.state.description}
						></textarea>
					</div>
				</div>

				<div className="more-infor-extra row">
					<div className="col-4 form-group">
						<label>Chọn giá</label>
						<Select
							// value={this.state.selectedDoctor}
							// onChange={this.handleChangeSelect}
							options={this.state.listPrice}
							placeholder={'Chọn giá'}
						/>
					</div>
					<div className="col-4 form-group">
						<label>Chọn phương thức thanh toán</label>
						<Select
							// value={this.state.selectedDoctor}
							// onChange={this.handleChangeSelect}
							options={this.state.listPayment}
							placeholder={'Chọn phương thức thanh toán'}
						/>
					</div>
					<div className="col-4 form-group">
						<label>Chọn tỉnh thành</label>
						<Select
							// value={this.state.selectedDoctor}
							// onChange={this.handleChangeSelect}
							options={this.state.listProvince}
							placeholder={'Chọn tỉnh thành'}
						/>
					</div>
					<div className="col-4 form-group">
						<label>Tên phòng khám</label>
						<input type="text" className="form-control" />
					</div>
					<div className="col-4 form-group">
						<label>Địa chỉ phòng khám</label>
						<input type="text" className="form-control" />
					</div>
					<div className="col-4 form-group">
						<label>Note</label>
						<input type="text" className="form-control" />
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

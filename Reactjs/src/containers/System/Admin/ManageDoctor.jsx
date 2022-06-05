import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import * as actions from '../../../store/actions';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { LANGUAGES } from '../../../utils';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contentMarkdown: '',
			contentHTML: '',
			selectedDoctor: '',
			description: '',
			listDoctors: [],
		};
	}

	componentDidMount() {
		this.props.fetchAllDoctors();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.allDoctors !== this.props.allDoctors) {
			let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
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
	}

	handleEditorChange = ({ html, text }) => {
		this.setState({
			contentMarkdown: text,
			contentHTML: html,
		});
	};

	handleSaveContentMarkdown = () => {
		this.props.saveDetailDoctor({
			contentHTML: this.state.contentHTML,
			contentMarkdown: this.state.contentMarkdown,
			description: this.state.description,
			doctorId: this.state.selectedDoctor.value,
		});
		console.log('hoidanit check state: ', this.state);
	};

	handleChange = (selectedDoctor) => {
		this.setState({ selectedDoctor }, () =>
			console.log(`Option selected:`, this.state.selectedDoctor)
		);
	};

	handleOnChangeDesc = (event) => {
		this.setState({ description: event.target.value });
	};

	buildDataInputSelect = (inputData) => {
		let result = [];
		let { language } = this.props;
		if (inputData && inputData.length > 0) {
			inputData.map((item, index) => {
				let object = {};
				let labelVi = `${item.lastName} ${item.firstName}`;
				let labelEn = `${item.firstName} ${item.lastName}`;
				object.label = language === LANGUAGES.VI ? labelVi : labelEn;
				object.value = item.id;
				result.push(object);
			});
		}

		return result;
	};

	render() {
		console.log('hoidanitChannel: ', this.state);

		return (
			<div className="manage-doctor-container">
				<div className="manage-doctor-title">
					Tạo thêm thông tin doctors
				</div>
				<div className="more-infor form-group">
					<div className="content-left">
						<label htmlFor="">Chọn bác sĩ</label>
						<Select
							value={this.state.selectedDoctor}
							onChange={this.handleChange}
							options={this.state.listDoctors}
						/>
					</div>
					<div className="content-right">
						<label htmlFor="">Thông tin giới thiệu</label>
						<textarea
							className="form-control"
							rows="4"
							onChange={(event) => this.handleOnChangeDesc(event)}
							value={this.state.description}
						></textarea>
					</div>
				</div>
				<div className="manage-doctor-editor">
					<MdEditor
						style={{ height: '500px' }}
						renderHTML={(text) => mdParser.render(text)}
						onChange={this.handleEditorChange}
					/>
				</div>
				<button
					className="save-content-doctor"
					onClick={() => this.handleSaveContentMarkdown()}
				>
					Lưu thông tin
				</button>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		language: state.app.language,
		allDoctors: state.admin.allDoctors,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
		saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);

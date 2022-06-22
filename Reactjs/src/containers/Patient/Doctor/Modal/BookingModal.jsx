import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';

class BookingModal extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	async componentDidMount() {}

	async componentDidUpdate(prevProps, prevState) {
		if (this.props.language !== prevProps.language) {
		}
	}

	render() {
		let { isOpenModal, closeBookingModal, dataTime } = this.props;

		let doctorId = '';
		if (dataTime && !_.isEmpty(dataTime)) {
			doctorId = dataTime.doctorId;
		}

		console.log('check props from modal : ', this.props);
		return (
			<Modal
				isOpen={isOpenModal}
				className={'booking-modal-container'}
				size="lg"
				centered
				// backdrop={true}
			>
				<div className="booking-modal-content">
					<div className="booking-modal-header">
						<span className="left">
							Thông tin đặt lịch khám bệnh
						</span>
						<span className="right" onClick={closeBookingModal}>
							<i className="fas fa-times"></i>
						</span>
					</div>
					<div className="booking-modal-body ">
						{/* {JSON.stringify(dataTime)} */}
						<div className="doctor-infor">
							<ProfileDoctor
								doctorId={doctorId}
								isShowDescriptionDoctor={false}
								dataTime={dataTime}
							/>
						</div>

						<div className="row">
							<div className="col-6 form-group">
								<label htmlFor="">Họ tên</label>
								<input type="text" className="form-control" />
							</div>
							<div className="col-6 form-group">
								<label htmlFor="">Số điện thoại</label>
								<input type="text" className="form-control" />
							</div>
							<div className="col-6 form-group">
								<label htmlFor="">Địa chỉ email</label>
								<input type="text" className="form-control" />
							</div>
							<div className="col-6 form-group">
								<label htmlFor="">Địa chỉ liên hệ</label>
								<input type="text" className="form-control" />
							</div>

							<div className="col-12 form-group">
								<label htmlFor="">Lý do khám</label>
								<input type="text" className="form-control" />
							</div>

							<div className="col-6 form-group">
								<label htmlFor="">Đặt cho ai</label>
								<input type="text" className="form-control" />
							</div>
							<div className="col-6 form-group">
								<label htmlFor="">Giới tính</label>
								<input type="text" className="form-control" />
							</div>
						</div>
					</div>
					<div className="booking-modal-footer">
						<button
							className="btn-booking-confirm"
							onClick={closeBookingModal}
						>
							Xác nhận
						</button>
						<button
							className="btn-booking-cancel"
							onClick={closeBookingModal}
						>
							Hủy
						</button>
					</div>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		language: state.app.language,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);

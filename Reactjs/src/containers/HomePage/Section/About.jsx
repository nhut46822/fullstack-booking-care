import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';

// import specialtyImg from '../../../assets/specialty/co-xuong-khop.jpg';

class About extends Component {
	render() {
		return (
			<div className="section-share section-about">
				<div className="section-about-header">
					Truyền thông nói về Channel Hỏi Dân IT
				</div>
				<div className="section-about-content">
					<div className="content-left">
						<iframe
							width="100%"
							height="400px"
							src="https://www.youtube.com/embed/21tjOW8BvB4?list=PLncHg6Kn2JT6E38Z3kit9Hnif1xC_9VqI"
							title="YouTube video player"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						></iframe>
					</div>
					<div className="content-right">
						<p>
							✔ Các bạn có thể làm chủ công nghệ, cũng như học
							được, biết được những kiến thức thực tế dùng tại các
							công ty hiện nay. Sau khi kết thúc khóa học này,
							mình tin chắc rằng dự án này đủ lớn, đủ thực tế để
							cho các bạn mới ra trường viết vào CV xin việc của
							mình ^^
						</p>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.user.isLoggedIn,
		language: state.app.language,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);

import { Row, Page, Text, Image, Col } from '@geist-ui/react';

export default function Home() {
	return (
		<Page>
			<Page.Content>
				<Row>
					<Col span={4}>
						<Image
							src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png"
							width="80"
							height="80"
							alt="logo"
						/>
					</Col>
					<Col>
						<Text h1>MS Teams</Text>
					</Col>
				</Row>
				<Row>
					<Text h4>Start or Join a meeting</Text>
				</Row>
			</Page.Content>
		</Page>
	);
}
// page -> row -> row

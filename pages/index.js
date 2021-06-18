import {
	Row,
	Spacer,
	Page,
	Text,
	Image,
	Col,
	Card,
	Tabs,
	User
} from '@geist-ui/react';
import { TwitchIcon, TwitterIcon } from '@geist-ui/react-icons';

export default function Home() {
	return (
		<>
			<Row>
				<Col>
					<Text h2 className="">
						Microsoft Teams
					</Text>
				</Col>
			</Row>
			<Spacer y={3} />
			<Row>
				<Card>
					<Tabs initialValue="1">
						<Tabs.Item label="Twitch TV" value="1">
							<Text>
								Hello, this is our live broadcast on Twitch.
							</Text>
						</Tabs.Item>

						<Tabs.Item label="Twitter" value="2">
							<Text>
								The Components of React looks very cool.
							</Text>
						</Tabs.Item>
					</Tabs>
					<Text h3>Start a meeting</Text>
				</Card>
			</Row>
		</>
	);
}

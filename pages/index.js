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
import { Header } from '../components/Header';

export default function Home() {
	return (
		<Page>
			<Page.Header>
				<Header />
			</Page.Header>
			<Page.Content>
				<Row>
					<Col span={4}>
						<Image
							src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png"
							width="60"
							height="60"
							alt="logo"
						/>
					</Col>
					<Col>
						<Text h2 className="mt-2.5">
							MS Teams
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
			</Page.Content>
		</Page>
	);
}
// page -> row -> row

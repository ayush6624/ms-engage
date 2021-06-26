import {
	Row,
	Spacer,
	Grid,
	Text,
	Col,
	Card,
	Button,
	Input,
	Image,
	Divider,
	useToasts
} from '@geist-ui/react';
import { PlusCircle } from '@geist-ui/react-icons';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { FaRegKeyboard } from 'react-icons/fa';
import { MeetingContext } from '../lib/context/token';

export default function Home() {
	const [session] = useSession();
	const { push } = useRouter();
	const [_toasts, setToast] = useToasts();
	const { setToken } = useContext(MeetingContext);

	const handleSubmit = async (username, roomName) => {
		const data = await fetch('/api/room', {
			method: 'POST',
			body: JSON.stringify({
				identity: username,
				room: roomName ?? undefined
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json());
		setToken(data.token);
		push(`/${data.room}`);
	};

	return (
		<>
			<Row>
				<Col>
					<Text h2>Microsoft Teams</Text>
				</Col>
			</Row>
			<Spacer y={3} />
			<Grid.Container gap={2} direction="row">
				<Grid md={12}>
					<Card shadow>
						<Text>Start a new Meeting</Text>
						<Button
							icon={<PlusCircle />}
							type="success-light"
							shadow
							onClick={async () => {
								if (session)
									await handleSubmit(
										session.user.email.split('@')[0]
									);
								else
									setToast({
										text: 'Please log in first!',
										type: 'error'
									});
							}}
						>
							New meeting
						</Button>
						<Divider y={4} />
						<form
							className="flex flex-row justify-between"
							onSubmit={(e) => console.log('submitted')}
						>
							<Input
								width="90%"
								icon={<FaRegKeyboard />}
								placeholder="Room Name"
								size="large"
							/>
							<Button
								htmlType="submit"
								type="success"
								ghost
								auto
								icon={<PlusCircle />}
							>
								Join
							</Button>
						</form>
					</Card>
				</Grid>
				<Grid md={12}>
					<Image
						src="https://images.idgesg.net/images/article/2020/04/video_conferencing_remote_work_online_meeting_by_rlt_images_gettyimages-1219032156_2400x1600_cw-100839430-large.jpg"
						alt="Promotional Image"
						width="500px"
						height="300px"
					/>
				</Grid>
			</Grid.Container>
		</>
	);
}

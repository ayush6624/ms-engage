import { Button, Image, Modal, useToasts } from '@geist-ui/react';
import { CheckInCircle } from '@geist-ui/react-icons';
import { useContext } from 'react';
import { MeetingContext } from '../lib/context/token';

const VirtualBackgroundModal = ({ showModal, setShowModal }) => {
	const links = [
		'/bg-1.jpg',
		'/bg-2.jpg',
		'/bg-3.png',
		'/bg-4.jpg',
		'/bg-5.jpg',
		'/bg-6.jpeg'
	];
	const { userBgLink, setUserBgLink, userBackground, setUserBackground } =
		useContext(MeetingContext);

	return (
		<Modal
			open={showModal}
			onClose={() => setShowModal(false)}
			width="75vw"
		>
			<Modal.Title>Virtual Background</Modal.Title>
			<Modal.Subtitle>
				Choose from a variety of backgrounds!
			</Modal.Subtitle>
			<Modal.Content className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-2">
				{links.map((link) => (
					<div key={link} className="relative">
						<Image
							onClick={() => console.log('lcocakc')}
							alt=""
							width={540}
							height={160}
							src={link}
						/>
						<div className="absolute top-0 ml-3 mt-3 w-full h-full z-10">
							<Button
								icon={<CheckInCircle />}
								auto
								type={
									userBgLink === link ? 'success-light' : 'default'
								}
								onClick={() => {
									setUserBgLink(link);
									setUserBackground('virtual');
									setTimeout(() => {
										setShowModal(false);
									}, 500);
								}}
							>
								{userBgLink === link && 'Selected'}
							</Button>
						</div>
					</div>
				))}
			</Modal.Content>
			<Modal.Action
				passive
				type="error"
				onClick={() => {
					setUserBgLink('');
					setUserBackground('');
					setShowModal(false);
				}}
			>
				Remove Background
			</Modal.Action>
		</Modal>
	);
};

export default VirtualBackgroundModal;

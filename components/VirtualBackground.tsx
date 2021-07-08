import { Button, Image, Modal } from '@geist-ui/react';
import { CheckInCircle } from '@geist-ui/react-icons';
import { Dispatch, SetStateAction } from 'react';
import { useContext } from 'react';
import { MeetingContext } from '../lib/context/tokenContext';

interface VirtualBackgroundModalProps {
	/* Visibility of the modal */
	showModal: boolean;

	/* Control the visibility of the modal */
	setShowModal: Dispatch<SetStateAction<boolean>>;
}

// Virtual Background Modal shows a list of images to choose from
const VirtualBackgroundModal: React.FC<VirtualBackgroundModalProps> = ({
	showModal,
	setShowModal
}) => {
	const links = [
		'/bg-1.jpg',
		'/bg-2.jpg',
		'/bg-3.png',
		'/bg-4.jpg',
		'/bg-5.jpg',
		'/bg-6.jpeg'
	];
	const { userBgLink, setUserBgLink, setUserBackground } =
		useContext(MeetingContext); // Sets the current background image in context

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
				{links.map((link: string) => (
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
									// Highlights the chosen image
									userBgLink === link
										? 'success-light'
										: 'default'
								}
								onClick={() => {
									// Sets the current virtual background as the selected image
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
					// Clears the Background
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

import { Clipboard, Share } from '@geist-ui/react-icons';
import { Code, Button, Input, useToasts, useClipboard } from '@geist-ui/react';
import { API_BASE_URL } from '../lib/config';
import { useState } from 'react';

export const InviteMember = ({ roomName }) => {
	const [inviteEmail, setInviteEmail] = useState();
	const { copy } = useClipboard();
	const [, setToast] = useToasts();

	return (
		<>
			<div className="flex flex-row items-center justify-around">
				<Code>{roomName}</Code>
				<Button
					size="small"
					auto
					icon={<Clipboard />}
					onClick={() => {
						copy(`https://teams.ayushgoyal.dev/${roomName}`);
						setToast({
							text: 'Copied to clipboard',
							type: 'secondary'
						});
					}}
				>
					Copy
				</Button>
			</div>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					await fetch(`${API_BASE_URL}/invite`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: inviteEmail,
							id: roomName
						})
					});
					setToast({
						text: 'Invitation Sent Successfully',
						type: 'success'
					});
					setInviteEmail('');
				}}
				className="mt-3 flex flex-row justify-around items-center"
			>
				<Input
					placeholder="Email ID"
					type="email"
                    value={inviteEmail}
					onChange={(e) => setInviteEmail(e.target.value)}
				></Input>
				<Input type="submit" icon={<Share />} />
			</form>
		</>
	);
};

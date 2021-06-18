import {
	Row,
	Spacer,
	Text,
	Image,
	Grid,
	ButtonDropdown,
	User,
	Button
} from '@geist-ui/react';
import { useSession, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Moon, Sun } from '@geist-ui/react-icons';

export function Header({ themeType, switchTheme }) {
	const [session, loading] = useSession();
	const { push } = useRouter();

	return (
		<Grid.Container justify="space-between" className="pt-3">
			<Grid>
				<Image
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png"
					width="40"
					height="40"
					alt="logo"
				/>
			</Grid>
			<Grid span={5} className="">
				{!session ? (
					<Button loading={loading} onClick={() => push('/login')}>
						Login
					</Button>
				) : (
					<ButtonDropdown size="medium">
						<ButtonDropdown.Item main>
							<User
								src={session?.user?.image}
								name={session?.user?.name}
							>
								<User.Link href="#">
									{session?.user?.email.split('@')[0]}
								</User.Link>
							</User>
						</ButtonDropdown.Item>
						<ButtonDropdown.Item
							type="error"
							onClick={() => signOut()}
						>
							Logout
						</ButtonDropdown.Item>
					</ButtonDropdown>
				)}
				<button
					className="inline-block align-middle ml-3"
					onClick={() => switchTheme()}
				>
					<span className="sr-only">Switch Theme</span>
					{themeType === 'light' ? <Moon /> : <Sun />}
				</button>
			</Grid>
		</Grid.Container>
	);
}

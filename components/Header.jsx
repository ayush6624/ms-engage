import {
	Image,
	Grid,
	ButtonDropdown,
	User,
	Button
} from '@geist-ui/react';
import { useSession, signOut, signin } from 'next-auth/client';
import { BASE_URL } from '../lib/url';
import { useRouter } from 'next/router';
import { Moon, Sun } from '@geist-ui/react-icons';
import { FcGoogle } from 'react-icons/fc';

export function Header({ themeType, switchTheme }) {
	const [session, loading] = useSession();
	const { push } = useRouter();

	return (
		<Grid.Container justify="space-between" className="pt-3">
			<Grid>
				<button onClick={() => push('/')}>
					<Image
						src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png"
						width="40"
						height="40"
						alt="logo"
					/>
				</button>
			</Grid>
			<Grid span={5} className="">
				{!session ? (
					<Button
						loading={loading}
						icon={<FcGoogle width="28px" height="28px" />}
						onClick={() => {
							signin('google', {
								callbackUrl: `${BASE_URL}`
							});
						}}
					>
						<span className="ml-5">Sign In With Google</span>
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

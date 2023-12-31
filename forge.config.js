module.exports = {
	packagerConfig: {
		asar: true,
		oxsSign: {},
		osxNotarize: {
			tool: 'notarytool',
			appleId: process.env.APPLE_ID,
			appleIdPassword: process.env.APPLE_PASSWORD,
			teamId: process.env.APPLE_TEAM_ID,
		}
	},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				certificateFile: './cert.pfx',
				certificatePassword: process.env.CERTIFICATE_PASSWORD
			},
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin'],
		},
		{
			name: '@electron-forge/maker-deb',
			config: {},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {},
		},
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				respository: {
					owner: 'ilovesoup20',
					name: 'playground-electron'
				},
				prerelease: false,
				draft: true
			}
		}
	],
	plugins: [
		{
			name: '@electron-forge/plugin-auto-unpack-natives',
			config: {},
		},
	],
};

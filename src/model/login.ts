export interface AdditionalInformation {
	sex: number;
	avatar: string;
	isBindWx: boolean;
	type: number;
	realname: string;
	uid: string;
	userAuthType: string;
	phone: string;
	nickname: string;
	id: string;
	scid: string;
	jobNumber: string;
	username: string;
	jti: string;
}

export interface RefreshToken {
	expiration: number;
	value: string;
}

export interface AdditionalInformation {
	additionalInformation: AdditionalInformation;
	expiration: number;
	expired: boolean;
	expiresIn: number;
	refreshToken: RefreshToken;
	scope: string[];
	tokenType: string;
	value: string;
}

export interface additionalInformationData {
	additionalInformation: AdditionalInformation;
}

export const successResponse = (
	message: string,
	data: object | null,
	meta?: object
) => {
	return {
		status: true,
		message: message,
		data: data,
		meta: meta,
	};
};

export const errorResponse = (message: string, data?: any[]) => {
	return {
		status: false,
		message: message,
		data: data,
	};
};

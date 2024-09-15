type THttpStatus = {
	[key: string]: number;
};

const httpStatus: THttpStatus = {
	OK: 200, // : 'OK';
	CREATED: 201, // : 'Created';
	ACCEPTED: 202, // : 'Accepted';
	NO_CONTENT: 204, // : 'No Content';
	BAD_REQUEST: 400, // : 'Bad Request';
	UNAUTHORIZED: 401, // : 'Unauthorized';
	FORBIDDEN: 403, // : 'Forbidden';
	NOT_FOUND: 404, // : 'Not Found';
	INTERNAL_SERVER_ERROR: 500, // : 'Server Error';
};

export { httpStatus };

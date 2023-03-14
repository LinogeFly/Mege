import axios from 'axios';
import { AuthService } from '../services/auth';

jest.mock('axios');
let sut: AuthService;

beforeEach(() => {
    sut = new AuthService();
});

describe("isAuthenticated", () => {
    it('resolves to "true" when Auth API responds with 200', async () => {
        expect.assertions(1);

        jest.mocked(axios.get).mockResolvedValue({
            status: 200
        });

        await expect(sut.isAuthenticated()).resolves.toBe(true);
    });

    it('resolves to "false" when Auth API responds with 401', async () => {
        expect.assertions(1);

        jest.mocked(axios.get).mockRejectedValue({
            response: {
                status: 401
            }
        });
        jest.mocked(axios.isAxiosError).mockReturnValue(true);

        await expect(sut.isAuthenticated()).resolves.toBe(false);
    });

    it('rejects when Auth API call fails', async () => {
        expect.assertions(1);

        jest.mocked(axios.get).mockRejectedValue({
            response: {
                status: 500
            }
        });
        jest.mocked(axios.isAxiosError).mockReturnValue(true);

        await expect(sut.isAuthenticated()).rejects.toBeDefined();
    });

    it('calls Auth API only once if used concurrently', async () => {
        expect.assertions(1);

        const mockedGet = jest.mocked(axios.get);
        mockedGet.mockResolvedValue({
            status: 200
        });

        const call1 = sut.isAuthenticated();
        const call2 = sut.isAuthenticated();

        await Promise.all([call1, call2])
            .then(() => {
                expect(mockedGet.mock.calls.length).toBe(1);
            })
    });

    it('calls Auth API only once if used consecutively', async () => {
        expect.assertions(1);

        const mockedGet = jest.mocked(axios.get);
        mockedGet.mockResolvedValue({
            status: 200
        });

        await sut.isAuthenticated();
        await sut.isAuthenticated();

        expect(mockedGet.mock.calls.length).toBe(1);
    });

    it('calls Auth API if used again after Auth API call failed', async () => {
        expect.assertions(1);

        jest.mocked(axios.get)
            .mockRejectedValueOnce({
                response: {
                    status: 500
                }
            }).mockResolvedValueOnce({
                status: 200
            })

        await sut.isAuthenticated()
            .catch(() => sut.isAuthenticated())
            .then(result => expect(result).toBe(true));
    })
});

describe('login', () => {
    it('calls Auth API', async () => {
        expect.assertions(1);

        const expected = {
            email: 'user@mege.com',
            password: 'Passw0rd'
        };
        const spy = jest.spyOn(axios, 'post');

        await sut.login(expected.email, expected.password);

        expect(spy).toBeCalledWith('/api/login', expected, undefined);
    });

    it('makes "isAuthenticated" to resolve to "true"', async () => {
        expect.assertions(1);

        jest.mocked(axios.post).mockResolvedValue({
            status: 200
        });

        await sut.login("user@mege.com", "Passw0rd");

        await expect(sut.isAuthenticated()).resolves.toBe(true);
    });
});

describe('logout', () => {
    it('calls Auth API', async () => {
        expect.assertions(1);

        const spy = jest.spyOn(axios, 'post');

        await sut.logout();

        expect(spy).toBeCalledWith('/api/logout', {}, undefined);
    });

    it('makes "isAuthenticated" to resolve to "false"', async () => {
        expect.assertions(1);

        jest.mocked(axios.post).mockResolvedValue({
            status: 200
        });

        await sut.logout();

        await expect(sut.isAuthenticated()).resolves.toBe(false);
    });
});

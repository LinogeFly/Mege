import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import debounce from 'lodash/debounce';
import axios from 'axios';
import { MemeTemplateListResponse } from '../../types/api';
import { alertService } from "../../services/alert";
import { logError } from '../../services/logger';
import auth from '../../services/auth';

interface Query {
    search: string,
    page: number,
    refresh?: Date // This is for manual refresh triggering. Refresh happens when setting the value to current timestamp.
}

function getApiUrlFor(query: Query) {
    const baseUrl = '/api/memetemplates';
    const queryString = new URLSearchParams();

    query.search && queryString.append('search', query.search);
    query.page && queryString.append('page', query.page.toString());

    if (queryString.toString())
        return baseUrl + '?' + queryString.toString();

    return baseUrl;
}

function MemeTemplateList() {
    const [data, setData] = useState<MemeTemplateListResponse>();
    const [deletingId, setDeletingId] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState<Query>({
        page: 1,
        search: ''
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const searchChangeDebounce = debounce((search: string) => {
        setQuery({
            page: 1,
            search: search
        });
    }, 500);

    function handleFirstPageClick(e: React.MouseEvent<HTMLButtonElement>) {
        setQuery({
            page: 1,
            search: query.search
        });
    }

    function handlePrevPageClick(e: React.MouseEvent<HTMLButtonElement>) {
        if (query.page === 1)
            return;

        setQuery({
            page: query.page - 1,
            search: query.search
        });
    }

    function handleNextPageClick(e: React.MouseEvent<HTMLButtonElement>) {
        if (data?.isLastPage)
            return;

        setQuery({
            page: query.page + 1,
            search: query.search
        });
    }

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        searchChangeDebounce(e.target.value);
    }

    function handleDelete(id: string) {
        if (!window.confirm("Are you sure you want to delete this meme template?"))
            return;

        setDeletingId(id);
    }

    function isLoading() {
        return loading || deletingId;
    }

    useEffect(() => {
        if (!deletingId)
            return;

        const abortController = new AbortController();

        axios.delete(`/api/memetemplates/${deletingId}`, {
            signal: abortController.signal
        })
            .then(response => {
                setLoading(true);
                setDeletingId(undefined);

                // Trigger meme template list to refresh
                setQuery(query => {
                    return { ...query, refresh: new Date() };
                });
            })
            .catch(error => {
                if (axios.isCancel(error))
                    return;

                setDeletingId(undefined);
                alertService.error("Unable to delete the meme template. Try again later.");
                logError(error);
            });

        return () => {
            abortController.abort();
        };
    }, [deletingId]);

    useEffect(() => {
        const abortController = new AbortController();
        const loadListData = axios.get<MemeTemplateListResponse>(getApiUrlFor(query), {
            signal: abortController.signal
        });
        const loadAuthData = auth.isAuthenticated({ signal: abortController.signal });

        loadListData
            .then(response => setData(response.data))
            .catch(error => {
                if (axios.isCancel(error))
                    return;

                logError(error);
            });

        loadAuthData
            .then(value => setIsAuthenticated(value))
            .catch(error => {
                if (axios.isCancel(error))
                    return;

                logError(error);
            });

        Promise.all([loadListData, loadAuthData])
            .then(() => setLoading(false))
            .catch((error) => {
                if (axios.isCancel(error))
                    return;

                alertService.error("Unable to load meme templates. Try again later.");
                setLoading(false);
            });

        return () => {
            abortController.abort();
        };
    }, [query]);

    return (
        <>
            <div className="mb-3">
                <input type={'search'} className="form-control" placeholder="Search all memes" onChange={handleSearchChange}></input>
            </div>
            {isLoading() && <div>Loading...</div>}
            {!isLoading() && data?.memeTemplates.map(memeTemplate => {
                return (
                    <div className="d-flex flex-row align-items-center" key={memeTemplate.id}>
                        <Link className="me-auto" to={`/meme/${memeTemplate.id}`}>{memeTemplate.name}</Link>
                        {isAuthenticated && <Link to="#" onClick={() => handleDelete(memeTemplate.id)}>Remove</Link>}
                    </div>
                )
            })}
            <nav className="mt-4">
                <ul className="pagination justify-content-center mb-0">
                    <li className={`page-item me-3 ${query.page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={handleFirstPageClick} >First</button>
                    </li>
                    <li className={`page-item me-3 ${query.page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={handlePrevPageClick}>Prev</button>
                    </li>
                    <li className={`page-item ${data?.isLastPage ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={handleNextPageClick}>Next</button>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default MemeTemplateList;
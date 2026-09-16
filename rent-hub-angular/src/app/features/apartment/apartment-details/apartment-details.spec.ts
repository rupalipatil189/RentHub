import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { ApartmentDetails } from './apartment-details';
import { ApartmentService } from '../../../core/apartment';
import { Apartmentdata } from '../../../models/apartments.models';
import { CommentData } from '../../../models/comment.models';

describe('ApartmentDetails', () => {
  let component: ApartmentDetails;
  let fixture: ComponentFixture<ApartmentDetails>;

  let apartmentServiceMock: {
    getApartmentById: ReturnType<typeof vi.fn>;
    getAllComments: ReturnType<typeof vi.fn>;
    addComment: ReturnType<typeof vi.fn>;
    addInquiry: ReturnType<typeof vi.fn>;
  };

  let activatedRouteMock: any;

  const mockApartment = {
    id: '1',
    ownerId: '2',
    title: 'Modern 1 BHK',
    description: 'Beautiful apartment in Hinjewadi',
    city: 'Pune',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    propertyType: 'Apartment',
    price: 15000,
    availableFrom: '2026-09-01',
  } as Apartmentdata;

  const mockComments: CommentData[] = [
    {
      id: '1',
      apartmentId: '1',
      userId: '10',
      userName: 'Rupali',
      text: 'Is this apartment available?',
      createdAt: '2026-08-20T11:00:00Z',
    },
    {
      id: '2',
      apartmentId: '2',
      userId: '11',
      userName: 'Swapnil',
      text: 'Nice apartment',
      createdAt: '2026-08-21T11:00:00Z',
    },
  ];

  beforeEach(async () => {
    apartmentServiceMock = {
      getApartmentById: vi.fn(),
      getAllComments: vi.fn(),
      addComment: vi.fn(),
      addInquiry: vi.fn(),
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('1'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ApartmentDetails],
      providers: [
        {
          provide: ApartmentService,
          useValue: apartmentServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApartmentDetails);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // -----------------------------------------
  // Component
  // -----------------------------------------

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // -----------------------------------------
  // ngOnInit
  // -----------------------------------------

  it('should get apartment id from route', () => {
    apartmentServiceMock.getApartmentById.mockReturnValue(
      of(mockApartment)
    );

    apartmentServiceMock.getAllComments.mockReturnValue(
      of(mockComments)
    );

    component.ngOnInit();

    expect(
      activatedRouteMock.snapshot.paramMap.get
    ).toHaveBeenCalledWith('id');
  });

  it('should call getApartmentById with apartment id', () => {
    apartmentServiceMock.getApartmentById.mockReturnValue(
      of(mockApartment)
    );

    apartmentServiceMock.getAllComments.mockReturnValue(
      of(mockComments)
    );

    component.ngOnInit();

    expect(
      apartmentServiceMock.getApartmentById
    ).toHaveBeenCalledWith('1');
  });

  it('should not call API when apartment id is missing', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

    component.ngOnInit();

    expect(
      apartmentServiceMock.getApartmentById
    ).not.toHaveBeenCalled();
  });

  it('should set apartmentData when API succeeds', () => {
    apartmentServiceMock.getApartmentById.mockReturnValue(
      of(mockApartment)
    );

    apartmentServiceMock.getAllComments.mockReturnValue(
      of(mockComments)
    );

    component.ngOnInit();

    expect(component.apartmentData()).toEqual(
      mockApartment
    );
  });

  it('should load comments after apartment is loaded', () => {
    apartmentServiceMock.getApartmentById.mockReturnValue(
      of(mockApartment)
    );

    apartmentServiceMock.getAllComments.mockReturnValue(
      of(mockComments)
    );

    component.ngOnInit();

    expect(
      apartmentServiceMock.getAllComments
    ).toHaveBeenCalled();
  });

  it('should handle apartment API error', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const error = new Error('API Error');

    apartmentServiceMock.getApartmentById.mockReturnValue(
      throwError(() => error)
    );

    component.ngOnInit();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'API ERROR:',
      error
    );

    consoleErrorSpy.mockRestore();
  });

  // -----------------------------------------
  // Comments
  // -----------------------------------------

  it('should load only comments for current apartment', () => {
    apartmentServiceMock.getApartmentById.mockReturnValue(
      of(mockApartment)
    );

    apartmentServiceMock.getAllComments.mockReturnValue(
      of(mockComments)
    );

    component.ngOnInit();

    expect(component.comments()).toEqual([
      mockComments[0],
    ]);
  });

  it('should set empty comments when no comments match', () => {
    apartmentServiceMock.getApartmentById.mockReturnValue(
      of(mockApartment)
    );

    apartmentServiceMock.getAllComments.mockReturnValue(
      of([
        {
          ...mockComments[0],
          apartmentId: '999',
        },
      ])
    );

    component.ngOnInit();

    expect(component.comments()).toEqual([]);
  });

  // -----------------------------------------
  // Favourite
  // -----------------------------------------

  it('should return when apartment is null', () => {
    component.apartmentData.set(null);

    expect(() => {
      component.markAsFavourite();
    }).not.toThrow();
  });

  it('should execute markAsFavourite when apartment exists', () => {
    component.apartmentData.set(mockApartment);

    expect(() => {
      component.markAsFavourite();
    }).not.toThrow();
  });

  // -----------------------------------------
  // Add Comment
  // -----------------------------------------

  it('should add comment with correct user information', () => {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: '10',
        name: 'Rupali',
      })
    );

    component.apartmentData.set(mockApartment);

    component.commentForm.patchValue({
      comment: 'Is this apartment available?',
    });

    const addedComment: CommentData = {
      id: '3',
      apartmentId: '1',
      userId: '10',
      userName: 'Rupali',
      text: 'Is this apartment available?',
      createdAt: '2026-08-25T10:00:00Z',
    };

    apartmentServiceMock.addComment.mockReturnValue(
      of(addedComment)
    );

    component.addComment();

    expect(
      apartmentServiceMock.addComment
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        apartmentId: '1',
        userId: '10',
        userName: 'Rupali',
        text: 'Is this apartment available?',
      })
    );
  });

  it('should add returned comment to comments signal', () => {
    component.apartmentData.set(mockApartment);

    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: '10',
        name: 'Rupali',
      })
    );

    component.commentForm.patchValue({
      comment: 'Looks good',
    });

    const addedComment: CommentData = {
      id: '3',
      apartmentId: '1',
      userId: '10',
      userName: 'Rupali',
      text: 'Looks good',
      createdAt: '2026-08-25T10:00:00Z',
    };

    apartmentServiceMock.addComment.mockReturnValue(
      of(addedComment)
    );

    component.addComment();

    expect(component.comments()).toContain(
      addedComment
    );
  });

  it('should reset comment form after successful comment', () => {
    component.apartmentData.set(mockApartment);

    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: '10',
        name: 'Rupali',
      })
    );

    component.commentForm.patchValue({
      comment: 'Test comment',
    });

    apartmentServiceMock.addComment.mockReturnValue(
      of({
        id: '3',
        apartmentId: '1',
        userId: '10',
        userName: 'Rupali',
        text: 'Test comment',
        createdAt: '2026-08-25T10:00:00Z',
      })
    );

    component.addComment();

    expect(
      component.commentForm.value.comment
    ).toBeNull();
  });

  it('should handle addComment error', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    component.apartmentData.set(mockApartment);

    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: '10',
        name: 'Rupali',
      })
    );

    component.commentForm.patchValue({
      comment: 'Test comment',
    });

    const error = new Error('Comment API failed');

    apartmentServiceMock.addComment.mockReturnValue(
      throwError(() => error)
    );

    component.addComment();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to add comment:',
      error
    );

    consoleErrorSpy.mockRestore();
  });

  // -----------------------------------------
  // Add Inquiry
  // -----------------------------------------

  it('should add inquiry with correct information', () => {
    component.apartmentData.set(mockApartment);

    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: '10',
        name: 'Rupali',
      })
    );

    component.inquiryForm.patchValue({
      inquiry: 'I am interested in this apartment',
    });

    apartmentServiceMock.addInquiry.mockReturnValue(
      of({})
    );

    component.addInquiry();

    expect(
      apartmentServiceMock.addInquiry
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        apartmentId: '1',
        userId: '10',
        userName: 'Rupali',
        ownerId: '2',
        message: 'I am interested in this apartment',
      })
    );
  });

  it('should show alert after successful inquiry', () => {
    const alertSpy = vi
      .spyOn(window, 'alert')
      .mockImplementation(() => {});

    component.apartmentData.set(mockApartment);

    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: '10',
        name: 'Rupali',
      })
    );

    component.inquiryForm.patchValue({
      inquiry: 'I want to visit this apartment',
    });

    apartmentServiceMock.addInquiry.mockReturnValue(
      of({})
    );

    component.addInquiry();

    expect(alertSpy).toHaveBeenCalledWith(
      'inquiry added'
    );

    alertSpy.mockRestore();
  });

  it('should handle addInquiry error', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    component.apartmentData.set(mockApartment);

    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: '10',
        name: 'Rupali',
      })
    );

    component.inquiryForm.patchValue({
      inquiry: 'Test inquiry',
    });

    const error = new Error('Inquiry API failed');

    apartmentServiceMock.addInquiry.mockReturnValue(
      throwError(() => error)
    );

    component.addInquiry();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to add comment:',
      error
    );

    consoleErrorSpy.mockRestore();
  });
});
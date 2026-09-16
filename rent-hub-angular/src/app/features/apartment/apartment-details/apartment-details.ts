import { Component, inject, OnInit, signal } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ApartmentService } from '../../../core/apartment';
import { Apartmentdata } from '../../../models/apartments.models';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommentData } from '../../../models/comment.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-apartment-details',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './apartment-details.html',
  styleUrl: './apartment-details.scss',
})
export class ApartmentDetails implements OnInit {
  private apartmentService = inject(ApartmentService);
  private route = inject(ActivatedRoute);

  public apartmentData = signal<Apartmentdata | null>(null);
  public comments = signal<CommentData[]>([]);

  public commentForm = new FormGroup({
    comment: new FormControl(''),
  });

  public inquiryForm = new FormGroup({
    inquiry: new FormControl(''),
  });

  ngOnInit(): void {
    const apartmentId = this.route.snapshot.paramMap.get('id');

    if (!apartmentId) {
      return;
    }

    this.apartmentService.getApartmentById(apartmentId).subscribe({
      next: (data) => {
        this.apartmentData.set(data);
        this.loadComments(data.id);
      },

      error: (error) => {
        console.error('API ERROR:', error);
      },
    });
  }

  private loadComments(apartmentId: string): void {
    this.apartmentService.getAllComments().subscribe((data: CommentData[]) => {
      this.comments.set(data.filter((comment) => comment.apartmentId === apartmentId));
    });
  }

  public markAsFavourite(): void {
    const apartment = this.apartmentData();
    if (!apartment) {
      return;
    }
  }

  public addComment() {
    const comment = {
      apartmentId: this.apartmentData()?.id,
      userId: JSON.parse(localStorage.getItem('currentUser') || '{}').id,
      userName: JSON.parse(localStorage.getItem('currentUser') || '{}').name,
      text: this.commentForm.value.comment,
      createdAt: new Date(),
    };

    this.apartmentService.addComment(comment).subscribe({
      next: (data) => {
        this.comments.update((comments) => [...comments, data]);
        this.commentForm.reset();
      },
      error: (error) => {
        console.error('Failed to add comment:', error);
      },
    });
  }

  public addInquiry() {
    const inquiry = {
      apartmentId: String(this.apartmentData()?.id),
      userId: JSON.parse(localStorage.getItem('currentUser') || '{}').id,
      userName: JSON.parse(localStorage.getItem('currentUser') || '{}').name,
      ownerId: String(this.apartmentData()?.ownerId),
      message: this.inquiryForm.value.inquiry,
      createdAt: new Date(),
    };

    this.apartmentService.addInquiry(inquiry).subscribe({
      next: (data) => {
        alert('inquiry added');
      },
      error: (error) => {
        console.error('Failed to add comment:', error);
      },
    });
  }
}

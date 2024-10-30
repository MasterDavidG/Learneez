<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagesTable extends Migration
{
    public function up()
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('textbook_id'); // Foreign key to textbooks table
            $table->string('audio_file')->nullable();
            $table->text('content');
            $table->string('image')->nullable();
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('textbook_id')->references('id')->on('textbooks')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pages');
    }
}
